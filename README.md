
# Things to help with Open Data Portal

## Import and export

### Get old orgs

	source /usr/lib/ckan/default/bin/activate
	ckanapi dump organizations --all -q -r http://hri.fi > hri_orgs.json
 	apt install jq
 	cat hri_orgs.json |jq --compact-output '{name, title, description}' > fixed_hri_orgs.json


### Dump new datasets

	ckanapi dump datasets --all -q -c /etc/ckan/default/production.ini > datasets


### Import old orgs

 	cat fixed_hri_orgs.json|ckanapi load organizations -c /etc/ckan/default/production.ini


### Dump old orgs as new orgs

 	ckanapi dump organizations --all -q -c /etc/ckan/default/production.ini > /vagrant/new_hri_orgs.json

New orgs now contain old orgs with new ids. **Remember to copy them where conversion happens**.


### Get old HRI datasets

	wget http://www.hri.fi/wp-content/uploads/ckan/hri-ckan-active-metadata-daily-output.json


### Convert old datasets for import

	# TODO: ** This first bit should be fixed **
	cp hri-ckan-active-metadata-daily-output.json hri.json
	node build/convert.js
	python filter_urls.py


### Load converted datasets
 	ckanapi load datasets -I /vagrant/out.json -c /etc/ckan/default/production.ini &> /vagrant/import_problems.txt


## Conversion tools

 * node build/convert.js
 * python filter_urls.py

