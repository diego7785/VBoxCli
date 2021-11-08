# VBoxCli

This CLI is able to create virtual machines from a given os name, run any created machine by its name, stop any created machine by its name and destroy by its name only machines that has been created using this CLI

## Requirements:

1. VirtualBox
2. Vagrant
3. Node.js


## Ussage:

```
node app.js {command}
```

## Commands:

**-c os_name:** Creates a virtual machine of the given os_name
```
node app.js -c ubuntu/xenial64
```
This returns the name of the virtual machine


**-r name_vm:** Runs the virtual machine that matchs the given name
```
node app.js -r b93ee3e4d4f612671299abec80b8c205
```

**-cr os_name:** Creates and run the virtual machine with the given os_name
```
node app.js -r ubuntu/xenial64
```

**-s name_vm:** Stops the virtual machine that matchs the given name
```
node app.js -s b93ee3e4d4f612671299abec80b8c205
```

**-d name_vm:** Destroys the virtual machine that matchs the given name
```
node app.js -d b93ee3e4d4f612671299abec80b8c205
```

