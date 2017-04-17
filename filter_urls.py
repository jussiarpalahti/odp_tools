import json

j = json.load(open('hri-ckan-active-metadata-daily-output.json'))
p = j['packages']
urls=[r['url'] for e in p for r in e['resources']]

import mimetypes
tied=[i for i in urls if mimetypes.guess_type(i)[0]]
open("resources.urls",'w').write('\n'.join(tied))
