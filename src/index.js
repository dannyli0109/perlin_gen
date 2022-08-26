let currentTime = 0;
function uuidv4() {
    return ([1e7]+1e3+4e3+8e3+1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    ).toUpperCase();
}

function randomRangeF(min, max)
{
    return Math.random() * (max - min) + min;
}

function generateMap(cellSize, width, height) {
    let map = [];
    for (let i = 0; i < width; i++){
        map[i] = [];
        for (let j = 0; j < height; j++){
            map[i][j] = 0;
        }
    };
}


function setup() {
  createCanvas(1000, 1000);
  createButton('Generate').mousePressed(() => {
      let projectFile = "./working/perlin.project"
      let cubeFile = "./working/cube.json"
      let colorMaterialFile = "./working/basicColor.mat"
      let promises = [fetch(projectFile), fetch(cubeFile), fetch(colorMaterialFile)];
        Promise.all(promises).then(responses => {
            return Promise.all(responses.map(response => response.json()));
        })
        .then(([projectData, cubeData, colorMaterialData]) => {
            // console.log(projectData.Levels[0].Scene[6]);
            let r = 100;
            let w = 50;
            let frequency = 10;
            let xRandom = randomRangeF(0, 100);
            let yRandom = randomRangeF(0, 100);
            for (let i = 0; i < w; i++){
                for (let j = 0; j < w; j++)
                {
                    let position = {
                        X: i * r,
                        Y: j * r,
                        Z: 0
                    }

                    let xFloat = i;
                    let yFloat = j;
                    let xSizeFloat = w;
                    let ySizeFloat = w;
                    let scale = 5;
                    let height = noise(xFloat / xSizeFloat * frequency + xRandom, yFloat / ySizeFloat * frequency + yRandom) * scale;
                    fill(map(height, 0, scale, 0, 255));
                    rect(i * r, j * r, r, r);

                    let cube  = JSON.parse(JSON.stringify(cubeData))
                    // console.log(colorMaterialData);
                    let uuid = uuidv4();
                    cube.RootComponent.Transform.Position = position;
                    cube.RootComponent.Transform.Scale.Z = height;
                    cube.Guid = uuid;
                    projectData.Levels[0].Scene.push(cube)
                }
            }
            return projectData;
        })
        .then((data) => {
            saveJSON(data, "perlin.json")
        })
  });
}
