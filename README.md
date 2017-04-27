
# Things to help with Open Data Portal

## Import and export

### Get old orgs

	ckanapi dump organizations --all -q -r http://hri.fi > hri_orgs.json
 	apt install jq
 	cat hri_orgs.json |jq --compact-output '{name, title, description}' > fixed_hri_orgs.json


 ### Import old orgs

 	fixed_hri_orgs.json|ckanapi load organizations -c /etc/ckan/default/production.ini


### Dump old orgs as new orgs

 	ckanapi dump organizations --all -q -c /etc/ckan/default/production.ini > /vagrant/new_hri_orgs.json
 	ckanapi load datasets -I /vagrant/out.json -c /etc/ckan/default/production.ini &> /vagrant/import_problems.txt


## Conversion tools

 * node build/convert.js
 * python filter_urls.py
