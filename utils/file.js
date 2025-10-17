const fs = require('fs');
const path = require('path');

const deleteFile = (filePath) => {
    // Ensure we get the absolute path to the file
    const fullPath = path.join(__dirname, '..', filePath);

    fs.unlink(fullPath, (err) => {
        if (err) {
            console.error('Failed to delete file:', fullPath, err);
        }
    });
};

exports.deleteFile = deleteFile;







// const fs = require('fs');

// const deleteFile = (filePath) => {
//     fs.unlink(filePath, (err) => {
//         if(err){
//             throw (err);
//         }
//     });
// }

// exports.deleteFile = deleteFile;