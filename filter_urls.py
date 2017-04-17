
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


def add_tags():

	from ckanapi import RemoteCKAN
	ua = 'ckanapiexample/1.0 (+http://hri.fi)'
	
	c = RemoteCKAN('http://hri.fi',user_agent=ua)

	tags = c.action.tag_list(all_fields=True)
	tags_data = dict(((g['name'], g) for g in tags))

	new_hri_docs = [json.loads(doc) for doc in open('out.json').read().split("\n")]

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

	result = [json.dumps(doc) for doc in new_hri_docs]
	open('out_w_tags.json', 'w').write('\n'.join(result))

add_tags()


def add_groups():

	from ckanapi import RemoteCKAN
	ua = 'ckanapiexample/1.0 (+http://hri.fi)'
	
	c = RemoteCKAN('http://hri.fi',user_agent=ua)
	
	groups = c.action.group_list(all_fields=True)
	groups_data = dict(((g['name'], g) for g in groups))

	new_hri_docs = [json.loads(doc) for doc in open('out.json').read().split("\n")]

	yes_groups = set()
	no_groups = set()
	
	for doc in new_hri_docs:
	
		doc_groups = []
	
		for doc_group in doc.get('groups', []):
	
			gdata = groups_data.get(doc_group)
	
			if gdata:
				doc_groups.append(gdata)
				yes_groups.add(doc_group)
			else:
				no_groups.add(doc_group)
	
		if doc_groups:
			doc['groups'] = doc_groups

		elif doc.get('groups'):
			del doc['groups']

	print("no group ", no_groups)
	print("----------------------")
	print("yes group ", yes_groups)

	result = [json.dumps(doc) for doc in new_hri_docs]
	open('out_w_groups.json', 'w').write('\n'.join(result))
