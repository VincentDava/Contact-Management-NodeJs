const fs= require('fs')

const dirpath ='./data'
if(!fs.existsSync(dirpath)){
    //if no data folder, make the folder
    fs.mkdirSync(dirpath)
}

const datapath = './data/contacts.json';
if(!fs.existsSync(datapath)){
    fs.writeFileSync(datapath,'[]','utf-8')
}
//get all contact in data
const loadContact = () =>{
    const fileBuffer = fs.readFileSync('data/contacts.json','utf-8')
    //make it into json format
    const contacts = JSON.parse(fileBuffer)
    return contacts;
}

//find contact
const findContact = (name) =>{
    const contacts = loadContact();
    const contact = contacts.find((contact) => contact.name === name)
    return contact;
}
//write  contacts.json with new data
const saveContacts = (contacts) =>{
    fs.writeFileSync('data/contacts.json', JSON.stringify(contacts));
}


const addContact = (contact) =>{
    const contacts = loadContact();
    contacts.push(contact);
    saveContacts(contacts);
}
//check duplicate name
const checkDuplicate = (name) =>{
    const contacts = loadContact();
    //if duplicate that return value, if not than null
    return contacts.find((contact) => contact.name === name)
}
//delete contact
const deleteContact = (name) =>{
    const contacts = loadContact();
    //add all not deleted contact to new obj 
    const filterContacts = contacts.filter((contact)=> contact.name!== name);
    saveContacts(filterContacts);
}

//update
const updateContact = (newContact)=>{
    const contacts = loadContact();
    //delete old contact yang namanya sama dgn oldName
    const filterContacts = contacts.filter((contact)=> contact.name!== newContact.oldName);
    //delete properti oldname di new contact
    delete newContact.oldName;
    filterContacts.push(newContact);
    saveContacts(filterContacts)


}
module.exports = {loadContact, findContact, addContact, checkDuplicate, deleteContact,updateContact}