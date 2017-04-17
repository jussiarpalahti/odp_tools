
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

get_resources()
get_organizations()
