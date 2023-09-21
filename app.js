// const http = require('http')
// const fs = require('fs')

const express = require('express')
const app= express()
const port=3000
//ini cmn mempermudah aja layouts
const expressLayouts = require('express-ejs-layouts')

const {loadContact, findContact, addContact, checkDuplicate, deleteContact, updateContact} = require('./utils/contacts')
const {body, check, validationResult} = require('express-validator')
//pake view engine ejs
app.set('view engine','ejs')
app.use(expressLayouts)

//middleware to post
app.use(express.urlencoded({extended:true}))

app.get('/',(req,res)=>{

    res.render('index',{
        nama: 'vincent davas',
        layout:'layouts/main-layout',
        title: 'Home',
        })
    
})


app.get('/contact',(req,res)=>{
    //use loadcontact to get data
    const contacts = loadContact();
    res.render('contact',{
        layout:'layouts/main-layout',
        title: 'Halaman Contact',
        contacts,
    })
})
//add data form
app.get('/contact/add',(req,res)=>{
    res.render('addcontact',{
        title: "ADD DATA FORM",
        layout: 'layouts/main-layout',
    })
})
//proses nambah kontak use post and express validator
app.post('/contact', [
    body('name').custom((value) =>{
        const duplicate = checkDuplicate(value);
        if(duplicate){
            throw new Error('Contact Name already used!')
        }
        return true;
    }),
    check('email','Email not valid!').isEmail(),
    body('nohp','Phone number not valid').isMobilePhone(),
    ],(req,res)=>{
    const errors = validationResult(req);
        if(!errors.isEmpty()){
            res.render('addcontact',{
                title:'Add contact form',
                layout: 'layouts/main-layout',
                errors: errors.array(),
            })
        }else{
       addContact(req.body)
       //make it back to contact list
       res.redirect('/contact')
        }

})

app.get('/contact/delete/:name',(req,res) => {
    const contact = findContact(req.params.name);
    if(!contact){
        res.status(404)
        res.send('<h1>404</h1>')
    }else{
        deleteContact(req.params.name)
        res.redirect('/contact')
    }
})

//Update data contact

app.get('/contact/edit/:name',(req,res)=>{
    const contact = findContact(req.params.name)
    res.render('editcontact',{
        title: "EDIT DATA FORM",
        layout: 'layouts/main-layout',
        contact
    })
})

app.post('/contact/update', [
    body('name').custom((value,{req}) =>{
        const duplicate = checkDuplicate(value);
        if(value!=req.body.oldName && duplicate){
            throw new Error('Contact Name already used!')
        }
        return true;
    }),
    check('email','Email not valid!').isEmail(),
    body('nohp','Phone number not valid').isMobilePhone(),
    ],(req,res)=>{
    const errors = validationResult(req);
        if(!errors.isEmpty()){
            res.render('editcontact',{
                title:'Edit contact form',
                layout: 'layouts/main-layout',
                errors: errors.array(),
                contact: req.body,
            });
        }else{
        updateContact(req.body)
       //make it back to contact list
       res.redirect('/contact')
        }

})
//detail contact
app.get('/contact/:name',(req,res)=>{
    //use loadcontact to get data
    const contact = findContact(req.params.name);
    res.render('detail',{
        layout:'layouts/main-layout',
        title: 'Halaman detail Contact',
        contact,
    })
})


app.get('/product/:id',(req,res)=>{

    res.send(`Product ID: ${req.params.id} <br/> Category ID: ${req.query.category}`)
})

app.use('/',(req,res)=>{
    res.status(404)
    res.send('<h1>404</h1>')
})
app.listen(port,()=>{
    console.log('Running...')
})