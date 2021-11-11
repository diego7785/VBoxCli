var vbox = require('virtualbox');
var fs = require('fs');
const { exec } = require("child_process");
const crypto = require('crypto');

// Name of the virtual machine and the folder where the virtual machine will be created
let id = crypto.randomBytes(16).toString("hex");

// If the command is related to run, stop or destroy the folder will not be created
let create = true
for(let i = 0; i < process.argv.length; i++) {
    if(process.argv[i] == '-r' || process.argv[i] == '-s' || process.argv[i] == '-d') {
        id = process.argv[i+1];
        create = false;
        break
    }
}

// The vagrantfile to create the virtual machine
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

// If the command is related to create the machine and its folder has not been created yet
// then the folder of the virtual machine will be created
const dir = './' + id;
if(create){
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {
            recursive: true
        });
    }
}

// Go over the arguments and execute the proccess that each argument represents
for(let i = 0; i < process.argv.length; i++){
    if(process.argv[i] == '-c'){
        createVagrantfile();
        console.log('Virtual Machine ', id), 'created';
    } else if(process.argv[i] == '-r'){
        runVagrantfile(process.argv[i+1]);
    } else if(process.argv[i] == '-s'){
        stopVM(process.argv[i+1]);
    } else if(process.argv[i] == '-cr'){
        createVagrantfile();
        runVagrantfile(id);
        console.log('Virtual Machine ', id), 'running';
    } else if (process.argv[i] == '-d'){
        destroyVM(process.argv[i+1]);
        console.log('Virtual Machine',id, 'destroyed');

    }
}

// Creates the vagrantfile inside the folder of the virtual machine
function createVagrantfile(){
    fs.writeFile('./'+id+'/Vagrantfile', vagrantfile, function (err) {
        if (err) throw err;
    });
}

// Tries to stand up the virtual machine using it's name, but if the virtual machine has not been run yet
// the it will try to run the vagrantfile that was created inside the virtual machine folder
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
            });
        };
    });
}

// Turns off the virtual machine
function stopVM(id){
    vbox.poweroff(id, function poweroff_callback(error) {
        if (error) throw error;
        console.log('Virtual Machine has been powered off!');
    });
}

// Destroy the virtual machines using the vagrant file created for it and deletes the folder that contains it
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
    });
}

