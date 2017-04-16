
import {NewDataset} from './new';
import {OriginalDataset} from './old';

import * as _ from 'lodash';
import * as fs from "fs";

function convert() {

    console.log("converting");
    let doc = <OriginalDataset> JSON.parse(
        fs.readFileSync('one_package.json', 'utf8'));
    let template = <OriginalDataset> JSON.parse(
        fs.readFileSync('template.json', 'utf8'));
    console.log("don't");
}

convert();
