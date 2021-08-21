const readline = require("readline");
const fs = require("fs/promises");


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function inputText(msg) {
    return new Promise((resolve) => {
        rl.question(msg, (answer) => {
            resolve(answer);
        });
    });
}
function inputNumber(msg) {
    return new Promise((resolve, reject) => {
        rl.question(msg, (answer) => {
            const num = parseFloat(answer);
            if (!isNaN(num) && Number.isFinite(num)) {
                resolve(num);
            } else {
                reject(new Error(`${answer} is not a number`));
            }
        });
    });
}

async function main() {
    while (true) {
        console.log(`1. atspausdinti visus zmones
2. prideti nauja
3. istrinti zmogu
4. turtuoliu sarsas
0. pabaigti`);

        let command;
        try {
            command = await inputNumber("");
        } catch (err) {
            console.log("blogas skaicius", err);
            continue;
        }

        if (command < 0 || command > 4) {
            continue;
        } else if (command === 0) {
            break;
        } else if (command === 1) {
            try {
                let zmonesJSON = await fs.readFile("zmones.json");
                let zmones = JSON.parse(zmonesJSON);
                for (let i = 0; i < zmones.length; i++) {
                    console.log(i + ".", zmones[i]);
                }
            } catch {
                continue;
            }
        } else if (command === 2) {
            let zmones = [];
            try {
                let zmonesJSON = await fs.readFile("zmones.json");
                zmones = JSON.parse(zmonesJSON);
            } catch {
            }

            let vardas = await inputText("Ivesk varda: ");
            let pavarde = await inputText("Ivesk pavarde: ");
            let alga;
            try {
                alga = await inputNumber("Ivesk alga: ");
            } catch (err) {
                console.log("blogas skaicius", err);
            }

            let zmogus = {
                vardas: vardas,
                pavarde: pavarde,
                alga: alga
            };
            zmones.push(zmogus);
            try {
                await fs.writeFile("zmones.json", JSON.stringify(zmones), {
                    encoding: "utf-8"
                });
            } catch (err) {
                console.log("Failed to write to file", err);
            }
        } else if (command === 3) {
            let zmones = [];
            try {
                let zmonesJSON = await fs.readFile("zmones.json");
                zmones = JSON.parse(zmonesJSON);
            } catch {
            }
            if (zmones.length > 0) {
                let index;
                try {
                    index = await inputNumber("Ivesk skaiciu: ");
                } catch (err) {
                    console.log("blogas skaicius", err);
                }
                if (zmones[index] !== undefined) {
                    zmones.splice(index, 1);
                    try {
                        await fs.writeFile("zmones.json", JSON.stringify(zmones), {
                            encoding: "utf-8"
                        });
                    } catch (err) {
                        console.log("Failed to write to file", err);
                    }
                }
            } else {
                console.log("Nera zmoniu");
            }
        } else if (command === 4) {
            let zmones = [];
            try {
                let zmonesJSON = await fs.readFile("zmones.json");
                zmones = JSON.parse(zmonesJSON);
            } catch {
            }
            if (zmones.length > 0) {
                let alga;
                try {
                    alga = await inputNumber("Ivesk minimalia alga: ");
                } catch (err) {
                    console.log("blogas skaicius", err);
                }
                zmones = zmones.filter(zmogus => zmogus.alga >= alga);
                for (let i = 0; i < zmones.length; i++) {
                    console.log(i + ".", zmones[i]);
                }
            } else {
                console.log("Nera zmoniu");
            }
        }
    }
    rl.close();
}

main();