import * as fs from 'node:fs/promises';


(async () => {

    const checkFileExists = async (path) => {
        try {
            const fileHandler = await fs.open(path, 'r'); // try to open the file in read mode to check if it exists
            fileHandler?.close(); // close the file handler if it was opened

            return true; // file exists
        } catch (error) {
            return false; // file does not exist
        }
    }

    const createFile = async(path) => {
        try {
            const fileExists = await checkFileExists(path);
            if (fileExists) {
                console.log("File already exists.");
                return;
            }
        } catch (error) {
            const newFileHandler = await fs.open(path, 'w');
            console.log("A new file has been created.");
            newFileHandler.close(); // close the file handler after creating the file
        }
    }

    const deleteFile = async (path) => {
        try {
            await checkFileExists(path);
            return 
        } catch (error) {
            const deletedFileHandler = await fs.rm(path);
            console.log("File has been deleted.");
            deletedFileHandler.close(); // close the file handler after deleting the file
        }
    }

    const renameFile = async (oldPath, newPath) => {
        try {
            await checkFileExists(oldPath);
            return 
        } catch (error) {
            const renamedFileHandler = await fs.rename(oldPath, newPath);
            console.log("File has been renamed.");
            renamedFileHandler.close(); // close the file handler after renaming the file
        }
    }
    
    //commands
    const CREATE_FILE_COMMAND = "create a file";
    const DELETE_FILE_COMMAND = "delete a file";
    const WRITE_FILE_COMMAND = "write to the file";
    const RENAME_FILE_COMMAND = "rename the file";
    const APPEND_FILE_COMMAND = "append to the file";

    const fileHandler = await fs.open('./command.txt', 'r') // open file 

    fileHandler.on("change", async() => {
            // get the size of the file to create a buffer of the correct size
            const size = (await fileHandler.stat()).size;
            const buff = Buffer.alloc(size);

            const offset = 0; // start reading from the beginning of the file
            const length = buff.byteLength;
            const position = 0; // start reading from the beginning of the file

            // read the content of the file into a buffer
           await fileHandler.read(
                buff, 
                offset, 
                length, 
                position
            ); 
            
            // decoding the buffer to a string and log it to the console
            const command = buff.toString('utf-8');

            // create a file:
            // create a file <path>
            if(command.includes(CREATE_FILE_COMMAND)) {
                const filePath = command.substring(CREATE_FILE_COMMAND.length + 1).trim();
                console.log(`Creating file at path: ${filePath}`);
                await createFile(filePath);
            }

            // delete a file:
            // delete a file <path>
            if(command.includes(DELETE_FILE_COMMAND)) {
                const filePath = command.substring(DELETE_FILE_COMMAND.length + 1).trim();
                console.log(`Deleting file at path: ${filePath}`);
                await deleteFile(filePath);
            }

            // write to a file:
            // write to a file <path> <content>
            if (command.includes(WRITE_FILE_COMMAND)) {
                const filePath = command.substring(WRITE_FILE_COMMAND.length + 1).trim();
                console.log(`Writing to file at path: ${filePath}`);
                 await writeFile(filePath, content);
            }

            // rename a file:
            // rename a file <oldPath> to <newPath>
            if(command.includes(RENAME_FILE_COMMAND)) {
                const index = command.indexOf(" to ");
                const oldPath = command.substring(RENAME_FILE_COMMAND.length + 1, index).trim();
                const newPath = command.substring(index + 4).trim();

                console.log(`Renaming file from path: ${oldPath} to path: ${newPath}`);
                await renameFile(oldPath, newPath);
            }

            // append to file:
            // append to file <path> <content>
            if (command.includes(APPEND_FILE_COMMAND)) {
                const filePath = command.substring(APPEND_FILE_COMMAND.length + 1).trim();
                console.log(`Appending to file at path: ${filePath}`);
                await appendToFile(filePath, content);
            }
           
    })

    // watcher...
    const watcher = fs.watch('./command.txt'); // .watch() can acept a file or directory path as an argument
    for await (const event of watcher) {
        if(event.eventType === "change") {
            fileHandler.emit("change"); // emit a custom event to trigger the reading of the file
        }
    }

    
})();