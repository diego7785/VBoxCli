# VBoxCli

## Ussage:

```
node app.js {command}
```

## Commands:

**-c os_name:** Creates a virtual machine of the given os_name
```
node app.js -c ubuntu/xenial64
```
This returns the id of the virtual machine


**-r id_vm:** Runs the virtual machine with the given id 
```
node app.js -r b93ee3e4d4f612671299abec80b8c205
```

**-cr os_name:** Creates and run the virtual machine with the given os_name
```
node app.js -r ubuntu/xenial64
```

**-s id_vm:** Stops the virtual machine with the given id 
```
node app.js -s b93ee3e4d4f612671299abec80b8c205
```

**-d id_vm:** Destroys the virtual machine with the given id 
```
node app.js -d b93ee3e4d4f612671299abec80b8c205
```

