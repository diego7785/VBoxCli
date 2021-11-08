var vbox = require('virtualbox');
var fs = require('fs');
const { exec } = require("child_process");
const crypto = require('crypto');

let id = crypto.randomBytes(16).toString("hex");

let create = true
for(let i = 0; i < process.argv.length; i++) {
    if(process.argv[i] == '-r' || process.argv[i] == '-s' || process.argv[i] == '-d') {
        id = process.argv[i+1];
        create = false;
        break
    }
}

const vagrantfile = `Vagrant.configure("2") do |config|
  config.vm.box = "${process.argv[3]}"
  config.vm.hostname = "${id}"
  config.vm.define "${id}"
  config.vm.provider "virtualbox" do |v|
    v.name = "${id}"
    v.memory = "512"
    v.cpus = "1"
  end
end
`

const dir = './' + id;
if(create){
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {
            recursive: true
        });
    }
}

for(let i = 0; i < process.argv.length; i++){
    if(process.argv[i] == '-c'){
        createVagrantfile();
        console.log('ID of VM: ', id);
    } else if(process.argv[i] == '-r'){
        runVagrantfile(process.argv[i+1]);
    } else if(process.argv[i] == '-s'){
        stopVM(process.argv[i+1]);
    } else if(process.argv[i] == '-cr'){
        createVagrantfile();
        runVagrantfile(id);
        console.log('ID of VM: ', id);
    } else if (process.argv[i] == '-d'){
        destroyVM(process.argv[i+1]);
    }
}

function createVagrantfile(){
    fs.writeFile('./'+id+'/Vagrantfile', vagrantfile, function (err) {
        if (err) throw err;
        console.log('File is created successfully.')
    });
}


function runVagrantfile(id){
    vbox.start(id, false, function start_callback(error) {
        if (error) {
            process.chdir('./'+id);
            exec("vagrant up", (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    return;
                }
                console.log(`stdout: ${stdout}`);
            });
        };
        console.log('Virtual Machine has started WITHOUT A GUI!');
    });
}

function stopVM(id){
    vbox.poweroff(id, function poweroff_callback(error) {
        if (error) throw error;
        console.log('Virtual Machine has been powered off!');
    });
}

function destroyVM(id){
    process.chdir('./'+id);

    exec("vagrant destroy -f", (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        process.chdir('..');
        fs.rmdir(id, {
            force: true, 
            recursive: true
        }, (error) => {
            console.log(error)
        });
        console.log(`stdout: ${stdout}`);
    });
}

