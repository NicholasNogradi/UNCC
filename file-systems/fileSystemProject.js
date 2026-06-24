import * as fs from 'node:fs/promises';
import path from 'node:path';

const filePath = path.join(process.cwd(), 'command.txt');
console.log(filePath);


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

            const newFileHandler = await fs.open(path, 'w');
            console.log("A new file has been created.");
            newFileHandler.close();
        } catch (error) {
            console.error("Error creating file:", error);
        }
    }

    const deleteFile = async (path) => {
        try {
            const fileExists = await checkFileExists(path);
            
            if (!fileExists) {
                console.log("File does not exist.");
                return;
            }
            
            await fs.unlink(path);
            console.log("File has been deleted.");
            
        } catch (error) {
            console.error("Error deleting file:", error);
        }
    }

    const renameFile = async (oldPath, newPath) => {
        try {
            const fileExists = await checkFileExists(oldPath);
            
            if (!fileExists) {
                console.log("File does not exist.");
                return;
            }

            // console.log(oldPath, newPath);

            await fs.rename(oldPath, newPath);
            console.log("File has been renamed.");

        } catch (error) {
            if (error.code === 'ENONET') {
                console.error("Error renaming file: A file with the new name already exists.");
            } else {
                console.error("Error renaming file:", error);
            }
        }
    }

    let addedContent;

    const appendToFile = async (path, content) => {
        if (addedContent === content) return;
        try {
            const fileExists = await checkFileExists(path);
            
            if (!fileExists) {
                console.log("File does not exist.");
                return;
            }
            addedContent = content;
            
            await fs.appendFile(path, content);
            console.log("Content has been appended to the file.");
        } catch (error) {
            console.error("Error appending to file:", error);
        }
    }
    
    //commands
    const CREATE_FILE_COMMAND = "create a file";
    const DELETE_FILE_COMMAND = "delete a file";
    const RENAME_FILE_COMMAND = "rename the file";
    const APPEND_FILE_COMMAND = "append to the file";

    const fileHandler = await fs.open(filePath, 'r') // open file 

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
                await createFile(filePath);
            }

            // delete a file:
            // delete a file <path>
            if(command.includes(DELETE_FILE_COMMAND)) {
                const filePath = command.substring(DELETE_FILE_COMMAND.length + 1).trim();
                console.log(`Deleting file at path: ${filePath}`);
                await deleteFile(filePath);
            }


            // rename a file:
            // rename a file <oldPath> to <newPath>
            if(command.includes(RENAME_FILE_COMMAND)) {
                const index = command.indexOf(" to ");
                const oldPath = command.substring(RENAME_FILE_COMMAND.length + 1, index).trim();
                const newPath = command.substring(index + 4).trim();
                // console.log(newPath);

                // console.log(`Renaming file from path: ${oldPath} to path: ${newPath}`);
                await renameFile(oldPath, newPath);
            }

            // append to file:
            // append to the file <path> content: <content>
            if (command.includes(APPEND_FILE_COMMAND)) {
                const index = command.indexOf(" content: ");
                const filePath = command.substring(APPEND_FILE_COMMAND.length + 1, index).trim();
                console.log(filePath);
                
                const content = command.substring(index + 10).trim();
                console.log(content)

               
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