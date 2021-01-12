const fs = require('fs');
const readline = require('readline');
const max_x = 5;
const max_y = 5;
const directions = [
    'NORTH',
    'EAST',
    'SOUTH',
    'WEST'
];
const directions_map = {
    'NORTH': 0,
    'EAST': 1,
    'SOUTH': 2,
    'WEST': 3
};

function simulator() {
    fs.stat('input', function(err,stat){
        if (err) {
            console.log(err);
            return;
        }

        const rl = readline.createInterface({
            input: fs.createReadStream('input'),
            crlfDelay: Infinity
        });
        let place = true;
        let current = {};
        rl.on('line', line => {
            const command = line.split(' ')[0];
            if (!place && command !== 'PLACE') return;
            let f = 0;
            switch (command) {
                case 'PLACE':
                    if (place_check(line)){
                        const data = line.split(' ')[1].split(',');
                        const x = parseInt(data[0].trim());
                        const y = parseInt(data[1].trim());
                        if (x > max_x - 1 || y > max_y - 1 || x < 0 || y < 0) return;
                        current.x = x;
                        current.y = y;
                        current.f = data[2].trim();
                        place = true;
                    } else {
                        console.log(`Invalid command: ${line}`);
                        return;
                    }
                    break;
                case 'MOVE':
                    if (current.f === 'NORTH'){
                        if (current.y + 1 === max_y) return;
                        current.y = current.y + 1
                    } else if (current.f === 'EAST'){
                        if (current.x + 1 === max_x) return;
                        current.x = current.x + 1
                    } else if (current.f === 'SOUTH'){
                        if (current.y === 0) return;
                        current.y = current.y - 1
                    } else if (current.f === 'WEST'){
                        if (current.x === 0) return;
                        current.x = current.x - 1
                    }
                    break;
                case 'LEFT':
                    f = directions_map[current.f];
                    current.f = directions[(f + 3) % 4];
                    break;
                case 'RIGHT':
                    f = directions_map[current.f];
                    current.f = directions[(f + 5) % 4];
                    break;
                case 'REPORT':
                    console.log(current.x+','+current.y+','+current.f);
                    break;
                default:
                    console.log(`Invalid command: ${line}`);
                    return;
            }
        });
    });
}

function place_check(line) {
    const info = line.split(' ')[1];
    if (!info) return false;
    const data = info.split(',');
    if (data.length !== 3) return false;
    if (!isNormalInteger(data[0].trim()) || !isNormalInteger(data[1].trim())) return false;
    return directions.includes(data[2].trim());

}

function isNormalInteger(str) {
    const n = Math.floor(Number(str));
    return n !== Infinity && String(n) === str && n >= 0;
}

simulator();