
import mimetypes
import json


packages = json.load(open('hri-ckan-active-metadata-daily-output.json'))['packages']


def get_resources():

    urls = [r['url'] for e in packages for r in e['resources']]
    orgs = [e['owner_org'] for e in packages for r in e['resources']]

    docs = [i for i in urls if mimetypes.guess_type(i)[0] or i.endswith('.px')]
    links = [i for i in urls if not mimetypes.guess_type(i)[0]]

    open("resources.urls",'w').write('\n'.join(docs))
    open("links.urls",'w').write('\n'.join(links))


def get_organizations():
    
    from ckanapi import RemoteCKAN
    ua = 'ckanapiexample/1.0 (+http://hri.fi)'
    
    c = RemoteCKAN('http://hri.fi',user_agent=ua)
    g = c.action.group_list()
    
    all_orgs = c.action.organization_list(all_fields=True)
    
    inuse_orgs = set([r['owner_org'] for r in packages])
    
    ok_orgs = [i for i in all_orgs if i['id'] in inuse_orgs]

    json.dump(ok_orgs, open("orgs.json",'w'), indent=2)

# get_resources()
# get_organizations()


def add_tags(new_hri_docs):

    from ckanapi import RemoteCKAN
    ua = 'ckanapiexample/1.0 (+http://hri.fi)'
    
    c = RemoteCKAN('http://hri.fi',user_agent=ua)

    tags = c.action.tag_list(all_fields=True)
    tags_data = dict(((g['name'], g) for g in tags))

    yes_tags = set()
    no_tags = set()
    
    for doc in new_hri_docs:
    
        doc_tags = []
    
        for doc_group in doc.get('tags', []):
    
            gdata = tags_data.get(doc_group)
    
            if gdata:
                doc_tags.append(gdata)
                yes_tags.add(doc_group)
            else:
                no_tags.add(doc_group)
    
        if doc_tags:
            doc['tags'] = doc_tags

        elif doc.get('tags'):
            del doc['tags']

    print("no group ", no_tags)
    print("----------------------")
    print("yes group ", yes_tags)


def flatten(a_list):
    return [t for subl in a_list for t in subl]


def fetch_cats_from_doc(doc):
    return [i['value'] for i in doc['extras'] if i['key'] == 'categories']


def get_cat(doc):
    resp = []
    for cat in fetch_cats_from_doc(doc):
        if cat.startswith('{'):
            vals = cat[1:-1].split(',')
            resp.append([val.replace('\"', '') for val in vals])
        else:
            resp.append([cat])
    return flatten(resp)


def get_cats(docs):
    resp = {}
    for doc in docs:
        resp[doc['id']] = get_cat(doc)
    return resp


def cats_to_groups_map(doc="hri_cat_to_groups.csv"):
    lines = [i.split(";") for i in open(doc).read().split('\n')]
    return dict(((a, b) for a,b in lines))


from ckanapi import RemoteCKAN
def add_groups(new_hri_docs, ckan_source="https://hri.dataportaali.com/data"):

    group_map = cats_to_groups_map()
    
    c = RemoteCKAN(ckan_source, user_agent='ckanapiexample/1.0')  
    groups = c.action.group_list(all_fields=True)
    groups_data = dict(
        ((g['name'], g) for g in groups)
        )

    yes_groups = set()
    no_groups = set()
    
    for doc in new_hri_docs:
        
        cats = get_cat(doc)
        doc_groups = []
    
        for cat in cats:
    
            gdata = groups_data.get(group_map.get(cat))
    
            if gdata:
                doc_groups.append(gdata)
        
        if doc_groups:
            doc['groups'] = doc_groups


def read_jsonl(doc):
    return [json.loads(obj) for obj in open(doc).read().split('\n') if obj.strip()]


def read_gzip_jsonl(doc):
    import gzip
    return [json.loads(obj) for obj in gzip.open(doc, 'rt', encoding='utf-8').read().split('\n') if obj.strip()]


def switch_new_owners(
    new_hri_docs, 
    new_owners_doc='new_hri_orgs.json',
    old_owners_doc='old_hri_orgs.json'):

    new_owners = {i['name']: i['id'] for i in read_jsonl(new_owners_doc)}
    old_owners = {i['id']: i['name'] for i in read_jsonl(old_owners_doc)}

    problems = []

    for doc in new_hri_docs:
        if doc['owner_org'] and old_owners.get(doc['owner_org']):
            doc['owner_org'] = new_owners[old_owners[doc['owner_org']]]
        else:
            problems.append(doc)
    
    return problems

def do_this_first(source='old_datasets.jsonl', target='hri.json', group_source="https://hri.dataportaali.com/data"):
    new_hri_docs = read_jsonl(source)
    add_groups(new_hri_docs, group_source)
    result = [json.dumps(doc) for doc in new_hri_docs]
    open(target, 'w').write('\n'.join(result))


def do_the_dance():

    new_hri_docs = [json.loads(doc) for doc in open('out.json').read().split("\n")]

    # Full ckanapi dump has all tag information already
    # add_tags(new_hri_docs)
    # add_groups(new_hri_docs)
    switch_new_owners(new_hri_docs)

    result = [json.dumps(doc) for doc in new_hri_docs]
    open('out_w_data.json', 'w').write('\n'.join(result))


if __name__ == '__main__':
    do_the_dance()

