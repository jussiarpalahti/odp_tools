
import {NewDataset} from './new';
import {OriginalDataset} from './old';

import * as fs from "fs";

function Convert() {

    let doc = <OriginalDataset> JSON.parse(fs.readFileSync('../one_package.json', 'utf8'));

}
