
import {NewDataset, NewResource, TitleTranslated} from './new';
import {OriginalDataset} from './old';

import * as _ from 'lodash';
import * as fs from "fs";

function convert(doc:OriginalDataset):NewDataset {

    let odp_doc = {} as NewDataset;

    odp_doc.author = doc.author;
    odp_doc.author_email = doc.author_email;
    odp_doc.date_released = "2017-03-08"; // TODO: Fix me
    odp_doc.date_updated = "2017-03-08"; // TODO: Fix me

    // doc.ckan_url;
    // doc.extras;


    odp_doc.groups = doc.groups;
    odp_doc.geographical_coverage = ['helsinki']; // TODO: Fix me
    odp_doc.license_id = "CC-BY-4.0"; // TODO: Fix me


    // doc.id;

    odp_doc.isopen = doc.isopen;
    odp_doc.license_title = doc.license;
    odp_doc.maintainer = doc.maintainer;
    odp_doc.maintainer_email = doc.maintainer_email;
    odp_doc.metadata_created = doc.metadata_created;
    odp_doc.metadata_modified = doc.metadata_modified;
    odp_doc.name = doc.name;
    odp_doc.notes = doc.notes;

    // doc.notes_rendered

    odp_doc.owner_org = doc.owner_org;
    odp_doc.private = doc.private;

    // doc.ratings_average
    // doc.ratings_count
    // doc.relationships

    odp_doc.resources = doc.resources.map((res) => {
        let ores = {} as NewResource;
        ores.cache_last_updated = res.cache_last_updated;
        ores.cache_url = res.cache_url;
        ores.created = res.created;
        ores.description = res.description;
        ores.format = res.format;
        ores.hash = res.hash;

        // res.id;

        ores.last_modified = res.last_modified;
        ores.mimetype = res.mimetype;
        ores.mimetype_inner = res.mimetype_inner;
        ores.name = res.name;

        // res.package_id

        ores.position = res.position;
        ores.resource_group_id = res.resource_group_id;
        ores.resource_type = res.resource_type;
        ores.size = res.size;

        // res.tracking_summary

        ores.url = res.url;

        // res.webstore_last_updated;
        // res.webstore_url

        return ores;
    });

    // res.revision_id
    odp_doc.state = doc.state;
    odp_doc.tags = doc.tags;
    odp_doc.title = doc.title;
    odp_doc.title_translated = <TitleTranslated> {
        fi: doc.title
    };

    // doc.tracking_summary

    odp_doc.type = doc.type;
    odp_doc.url = doc.url;
    odp_doc.version = doc.version;

    return odp_doc;

}

console.log("converting");

let old = JSON.parse(fs.readFileSync('hri.json', 'utf8'));

let old_packages = old.packages as OriginalDataset[];

let result = [] as string[];

for (let doc of old_packages) {
    // Output is in JSON stream format meaning new line separated objects
    result.push(JSON.stringify(convert(doc)));
}

fs.writeFileSync('out.json', result.join("\n"), {encoding: 'utf8'});

console.log("conversion done");
