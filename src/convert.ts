
import {NewDataset, NewResource, TitleTranslated, NameTranslated, NotesTranslated, DescriptionTranslated} from './new';
import {OriginalDataset} from './old';

import * as _ from 'lodash';
import * as fs from "fs";
import { DateTime } from 'luxon';


const to_ISO = (d:string) => DateTime.fromISO(d).toISODate();


export function get_date_released(date_string:string, created:string):string {
    let d;
    if (date_string.search('/') !== -1) {
        let created_date = to_ISO(created) // ambiguous dates are changed to doc metadata creation date
        if (!created_date) return "1971-01-01"
        else return created_date;
    } else {
        d =  DateTime.fromString(date_string, 'yyyy-yy-dd');
        if (d.isValid) return d.toISODate()
        else {
            let created_date = to_ISO(created) // ambiguous dates are changed to doc metadata creation date
            if (!created_date) return "1971-01-01"
            else return created_date;
        }
    }
}


export function get_date_updated(date_string:string):string {
    let d;
    if (date_string.search('/') !== -1) {
        return '1970-01-01' // ambiguous dates are defaulted to this date
    } else {
        d =  DateTime.fromString(date_string, 'yyyy-yy-dd');
        return d.isValid ? d.toISODate() : "1970-01-01";  // ambiguous dates are defaulted to this date
    }
}


interface Extras {
    date_released: string;
    date_updated: string;
    geographic_coverage: string[];
    search_info: string;
}

function fix_areas(area:string):string {
    return area.replace(/\W+/g, " ");
}


function get_extras(doc:OriginalDataset):Extras {
    /*
        Get various extras fields from doc into one object
    */
    
    let extras = <Extras>{};

    for (let field of doc.extras) {

        switch (field.key) {
            case "date_released":
                extras.date_released = get_date_released(field.value, doc.metadata_created);
                break;
            case "date_updated":
                extras.date_updated = get_date_updated(field.value);
                break;
            case "geographic_coverage":
                if (field.value.search('{') !== -1) {
                    extras.geographic_coverage = _.trim(field.value)
                        .slice(1, -1).
                        replace(new RegExp('"', "g"), '').
                        split(',').
                        filter(_.identity).
                        map(a => fix_areas(a));
                } else {
                    extras.geographic_coverage = [fix_areas(field.value)];
                }
                break;
            case "search_info":
                extras.search_info = field.value;
                break;
        }

    }

    return extras;

}

interface TranslatedFields {
    title: TitleTranslated;
    name: NameTranslated;
    notes: NotesTranslated;
    description: DescriptionTranslated;
}

function translate_fields(doc:OriginalDataset):TranslatedFields {
    /*
        Get translated fields from doc extra fields into one object
    */

    // TODO: external_reference field?

    let translations = <TranslatedFields>{
        title: {
          "fi": doc.title
        },
        name: {
          "fi": doc.name
        },
        notes: {
          "fi": doc.notes
        },
        description: {
          // TODO: description field is for resources only?
          // "fi": doc.description
        }
    }

    for (let field of doc.extras) {

        let field_properties = field.key.split('_');

        let identifier:string, language:string;
        if (field_properties.length == 2) {
            [identifier, language] = field_properties;
        } else {
            continue;
        }

        switch (identifier) {
            case "title":
                translations.title[language] = field.value;
                break;

            case "name":
                translations.name[language] = field.value;
                break;

            case "notes":
                translations.notes[language] = field.value;
                break;

            case "description":
                translations.description[language] = field.value;
                break;
        }

    }

    return translations;

}


function convert(doc:OriginalDataset):NewDataset {

    let odp_doc = {} as NewDataset;
    let translations = translate_fields(doc);
    let extras = get_extras(doc);

    odp_doc.author = doc.author;
    odp_doc.author_email = doc.author_email;
    
    if (extras.date_released) odp_doc.date_released = extras.date_released;
    if (extras.date_updated) odp_doc.date_updated = extras.date_updated;

    if (extras.search_info) odp_doc.search_synonyms = extras.search_info;

    // doc.ckan_url;
    // doc.extras;

    // Only finnish tags in old datasets
    odp_doc.keywords = {fi: doc.tags.map(tag => tag.name)};

    odp_doc.groups = doc.groups;
    odp_doc.geographical_coverage = extras.geographic_coverage;
    odp_doc.license_id = "CC-BY-4.0"; // TODO: Fix me


    // doc.id;

    odp_doc.isopen = doc.isopen;
    odp_doc.license_title = doc.license;
    odp_doc.maintainer = doc.maintainer;
    odp_doc.maintainer_email = doc.maintainer_email;
    odp_doc.metadata_created = doc.metadata_created;
    odp_doc.metadata_modified = doc.metadata_modified;
    odp_doc.name = doc.name;
    odp_doc.name_translated = translations.name;
    odp_doc.notes = doc.notes;
    odp_doc.notes_translated = translations.notes;

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
        ores.description_translated = {
            fi: res.description
        }
        ores.format = res.format;
        ores.hash = res.hash;

        // res.id;

        ores.last_modified = res.last_modified;
        ores.mimetype = res.mimetype;
        ores.mimetype_inner = res.mimetype_inner;

        if (res.name) {
            ores.name = res.name;
            ores.name_translated = {
                fi: res.name
            }
        } else {
            ores.name = res.description;
            ores.name_translated = {
                fi: res.description
            }
        }

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
    odp_doc.title_translated = translations.title;

    // doc.tracking_summary

    odp_doc.type = doc.type;
    odp_doc.url = doc.url;
    odp_doc.version = doc.version;

    return odp_doc;

}

console.log("converting");

let old = [];
let docs = fs.readFileSync('hri_temp.jsonl', 'utf8');
for (let doc of docs.split('\n')) {
    old.push(JSON.parse(doc));
}

let old_packages = old as OriginalDataset[];

let result = [] as string[];

for (let doc of old_packages) {
    result.push(JSON.stringify(convert(doc)));
}

// Output is in JSON stream format meaning new line separated objects
fs.writeFileSync('to_qa_converted.json', result.join("\n"), {encoding: 'utf8'});

console.log("conversion done");
