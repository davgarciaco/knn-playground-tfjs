import { Party } from '../dto/party.dto';
import { generateDates, generateEventTypes } from '../data-generation/event-planner';
import * as fs from 'fs';
var newData = new Array(300);
for (var i = 0; i < newData.length; i++) {
    newData[i] = new Party(generateEventTypes(), generateDates(2020, 2));
}
console.table(newData);
var PATH = './generated-data/';
fs.writeFileSync(PATH + "Party.json", JSON.stringify(newData, null, 3));
console.log("DONE");
process.exit();
//# sourceMappingURL=index.js.map