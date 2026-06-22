import * as fs from 'node:fs/promises';

(async () => {
    const watcher = fs.watch('./command.txt'); 
    const content = await fs.readFile('./command.txt')

    

    for await (const event of watcher) {
        if(event.eventType === "change") {
            console.log("command.txt has been changed");
        }

  
    }

    
})();