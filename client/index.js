"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var Role;
(function (Role) {
    Role[Role["SUPERADMIN"] = 0] = "SUPERADMIN";
    Role[Role["ADMIN"] = 1] = "ADMIN";
    Role[Role["SUBSCRIBER"] = 2] = "SUBSCRIBER";
})(Role || (Role = {}));
;
let crudObject; //array of objects to be displayed on frontend
//DECORATOR FACTORY
function FormatDate() {
    return function (target, name, descriptor) {
        const dateTime = document.getElementById("dateTime");
        dateTime.innerHTML = new Date().toLocaleString();
        setInterval(function () {
            dateTime.innerHTML = new Date().toLocaleString();
        }, 1000);
    };
}
//MODEL CLASS FOR USER ENTRY
class Crud {
    constructor() {
        this.items = [];
    }
    add(object) {
        this.items.push(object);
    }
    update(id, index, updatedObject) {
        editUser(id, updatedObject).then((response) => {
            this.items[index] = response.updatedRecord;
            alert(response.message);
            showTable();
        }).catch(() => {
            console.log('update');
            alert("Unexpected Error Occured !");
        });
    }
    delete(id, index, object) {
        //make api call to delete data 
        deleteUser(id).then((response) => {
            //delete data on front end
            this.items.splice(index, 1);
            alert(response.message);
            showTable();
        }).catch(() => { alert("Unexpected Error Occured !"); });
    }
}
__decorate([
    FormatDate()
], Crud.prototype, "add", null);
//API CALLS ========================================================================================================================================
function addUser(object) {
    return __awaiter(this, void 0, void 0, function* () {
        let response = yield fetch(`http://localhost:3000/api/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(object)
        });
        let data = yield response.json();
        console.log(data);
        return data;
    });
}
function getUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        let response = yield fetch('http://localhost:3000/api');
        let users = yield response.json();
        console.log(users);
        return users; // same as Promise.resolve(users)
    });
}
function deleteUser(id) {
    return __awaiter(this, void 0, void 0, function* () {
        let response = yield fetch(`http://localhost:3000/api/${id}`, {
            method: 'DELETE'
        });
        let data = yield response.json();
        return data;
    });
}
function editUser(id, object) {
    return __awaiter(this, void 0, void 0, function* () {
        let response = yield fetch(`http://localhost:3000/api/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(object)
        });
        let data = yield response.json();
        return data;
    });
}
//=====================================================================================================================================================
//MAKES THE CONTENT OF CURRENT ROW EDITABLE
function editRow(no) {
    let currentRow = document.getElementById("row" + no);
    currentRow.style.background = "yellow";
    //SHOW SAVE & CANCEL BUTTON
    let saveButton = document.getElementById("saveButtonRow" + no);
    let cancelButton = document.getElementById("cancelButtonRow" + no);
    let headerSave = document.getElementById("headerSave");
    let headerCancel = document.getElementById("headerCancel");
    saveButton.style.display = "";
    cancelButton.style.display = "";
    headerSave.style.display = "";
    headerCancel.style.display = "";
    //MAKE ROW EDITABLE 
    let rowId = document.getElementById("row" + no + "Id");
    let rowFname = document.getElementById("row" + no + "Fname");
    let rowMname = document.getElementById("row" + no + "Mname");
    let rowLname = document.getElementById("row" + no + "Lname");
    let rowEmail = document.getElementById("row" + no + "Email");
    let rowPhone = document.getElementById("row" + no + "Phone");
    let rowRole = document.getElementById("row" + no + "Role");
    let rowAddress = document.getElementById("row" + no + "Address");
    rowFname.setAttribute("contenteditable", "true");
    rowMname.setAttribute("contenteditable", "true");
    rowLname.setAttribute("contenteditable", "true");
    rowEmail.setAttribute("contenteditable", "true");
    rowPhone.setAttribute("contenteditable", "true");
    rowRole.setAttribute("contenteditable", "true");
    rowAddress.setAttribute("contenteditable", "true");
}
function getCurrentRowData(no) {
    let rowId = document.getElementById("row" + no + "Id").innerHTML;
    let rowFname = document.getElementById("row" + no + "Fname").innerHTML;
    let rowMname = document.getElementById("row" + no + "Mname").innerHTML;
    let rowLname = document.getElementById("row" + no + "Lname").innerHTML;
    let rowEmail = document.getElementById("row" + no + "Email").innerHTML;
    let rowPhone = document.getElementById("row" + no + "Phone").innerHTML;
    let rowRole = document.getElementById("row" + no + "Role").innerHTML;
    let rowAddress = document.getElementById("row" + no + "Address").innerHTML;
    let r = -1;
    if (rowRole.toLowerCase() === "superadmin")
        r = 0;
    else if (rowRole.toLowerCase() === "admin")
        r = 1;
    else
        r = 2;
    let object = {
        id: parseInt(rowId),
        firstName: rowFname,
        middleName: rowMname,
        lastName: rowLname,
        email: rowEmail,
        phoneNumber: rowPhone,
        role: r,
        address: rowAddress
    };
    return object;
}
function showTable() {
    //console.log("showtable");
    var table = document.createElement("table"); // TS knows that only a generic html element is returned by createElement, hence we need to specify
    table.className = 'table table-hover';
    // EXTRACT VALUE FOR HTML HEADER. 
    let tr = table.insertRow(-1);
    let headerElements = ["ID", "First Name", "Middle Name", "Last Name", "Email", "Phone Number", "Role", "Address"];
    for (let i = 0; i < headerElements.length; i++) {
        let th = document.createElement("th"); // TABLE HEADER.
        th.innerHTML = headerElements[i];
        tr.appendChild(th);
    }
    let thEdit = document.createElement("th"); // TABLE HEADER.
    thEdit.innerHTML = "Edit";
    tr.appendChild(thEdit);
    let thDelete = document.createElement("th"); // TABLE HEADER.
    thDelete.innerHTML = "Delete";
    tr.appendChild(thDelete);
    let thSave = document.createElement("th"); // TABLE HEADER. 
    thSave.innerHTML = "Save";
    tr.appendChild(thSave);
    let thCancel = document.createElement("th"); // TABLE HEADER. 
    thCancel.innerHTML = "Cancel";
    tr.appendChild(thCancel);
    thSave.style.display = "none";
    thCancel.style.display = "none";
    thSave.id = "headerSave";
    thCancel.id = "headerCancel";
    //populate from Crud object items data 
    for (let i = 0; i < crudObject.items.length; i++) {
        tr = table.insertRow(-1);
        tr.id = "row" + (i);
        let cell1 = tr.insertCell(-1);
        let id = crudObject.items[i].id;
        cell1.innerHTML = `${id}`;
        cell1.id = "row" + (i) + "Id";
        let cell2 = tr.insertCell(-1);
        let fname = crudObject.items[i].firstName;
        cell2.innerHTML = fname;
        cell2.id = "row" + (i) + "Fname";
        let cell3 = tr.insertCell(-1);
        let mname = crudObject.items[i].middleName;
        ;
        cell3.innerHTML = mname;
        cell3.id = "row" + (i) + "Mname";
        let cell4 = tr.insertCell(-1);
        let lname = crudObject.items[i].lastName;
        cell4.innerHTML = lname;
        cell4.id = "row" + (i) + "Lname";
        let cell5 = tr.insertCell(-1);
        let email = crudObject.items[i].email;
        cell5.innerHTML = email;
        cell5.id = "row" + (i) + "Email";
        let cell6 = tr.insertCell(-1);
        let phone = crudObject.items[i].phoneNumber;
        cell6.innerHTML = phone;
        cell6.id = "row" + (i) + "Phone";
        let cell7 = tr.insertCell(-1);
        let role = Role[crudObject.items[i].role];
        cell7.innerHTML = role;
        cell7.id = "row" + (i) + "Role";
        let cell8 = tr.insertCell(-1);
        let add = crudObject.items[i].address;
        cell8.innerHTML = add;
        cell8.id = "row" + (i) + "Address";
        cell2.className = "editable";
        cell3.className = "editable";
        cell4.className = "editable";
        cell5.className = "editable";
        cell6.className = "editable";
        cell7.className = "editable";
        cell8.className = "editable";
        //BUTTONS ON EACH ROW
        //EDIT
        let cellForEditButton = tr.insertCell(-1);
        let editButton = document.createElement('button');
        editButton.type = 'button';
        editButton.innerHTML = 'Edit';
        cellForEditButton.appendChild(editButton);
        editButton.addEventListener('click', function () { editRow(i); });
        //DELETE
        let cellForDeleteButton = tr.insertCell(-1);
        let deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.innerHTML = 'Delete';
        cellForDeleteButton.appendChild(deleteButton);
        deleteButton.addEventListener('click', function () {
            let deleteObject = getCurrentRowData(i);
            //Finding index of  object to be deleted in items Array
            let index = -1;
            for (let i = 0; i < crudObject.items.length; i++) {
                if (crudObject.items[i].id === id) {
                    index = i;
                    break;
                }
            }
            crudObject.delete(id, index, deleteObject);
        });
        //SAVE
        let cellForSaveButton = tr.insertCell(-1);
        let saveButton = document.createElement('button');
        saveButton.type = 'button';
        saveButton.innerHTML = 'Save';
        cellForSaveButton.className = 'hiddenElements';
        cellForSaveButton.id = 'saveButtonRow' + i;
        cellForSaveButton.appendChild(saveButton);
        cellForSaveButton.style.display = "none";
        saveButton.addEventListener('click', function () {
            let updatedRowObject = getCurrentRowData(i);
            //Finding index of previous object in items Array
            let index = -1;
            for (let i = 0; i < crudObject.items.length; i++) {
                if (crudObject.items[i].id === id) {
                    index = i;
                    break;
                }
            }
            crudObject.update(id, index, updatedRowObject);
            let saveButton = document.getElementById("saveButtonRow" + i);
            let cancelButton = document.getElementById("cancelButtonRow" + i);
            let headerSave = document.getElementById("headerSave");
            let headerCancel = document.getElementById("headerCancel");
            saveButton.style.display = "none";
            cancelButton.style.display = "none";
            headerSave.style.display = "none";
            headerCancel.style.display = "none";
        });
        //CANCEL
        let cellForCancelButton = tr.insertCell(-1);
        let cancelButton = document.createElement('button');
        cancelButton.type = 'button';
        cancelButton.innerHTML = 'Cancel';
        cellForCancelButton.className = 'hiddenElements';
        cellForCancelButton.id = 'cancelButtonRow' + (i);
        cellForCancelButton.appendChild(cancelButton);
        cellForCancelButton.style.display = "none";
        cancelButton.addEventListener('click', function () { showTable(); });
    }
    let divContainer = document.getElementById("showData");
    divContainer.innerHTML = "";
    divContainer.appendChild(table);
    let loadButton = document.getElementById("showDataButton");
    loadButton.value = "Refresh";
}
function main() {
    const result = document.getElementById('showData');
    getUsers()
        .then(usersArray => {
        crudObject = new Crud(); //creating object of crud with generic type of user
        usersArray.forEach(function (object) { crudObject.add(object); }); //pushing objects obtained via api into array
        showTable();
        // Promise.resolve();
    })
        .catch(() => {
        console.log('get');
        alert("Unexpected Error Occured !");
    });
}
function addUserMain(e) {
    e.preventDefault();
    console.log("Add user");
    let firstName = document.getElementById("addUserFirstName").value;
    let middleName = document.getElementById("addUserMiddleName").value;
    let lastName = document.getElementById("addUserLastName").value;
    let email = document.getElementById("addUserEmail").value;
    let phoneNumber = document.getElementById("addUserPhoneNumber").value;
    let r = document.getElementById("addUserRole").value;
    let address = document.getElementById("addUserAddress").value;
    // console.log(address)
    // console.log("Aa")
    let role = -1;
    if (r.toLowerCase() === "superadmin")
        role = 0;
    else if (r.toLowerCase() === "admin")
        role = 1;
    else
        role = 2;
    let newMember = {
        firstName: firstName,
        middleName: middleName,
        lastName: lastName,
        email: email,
        phoneNumber: phoneNumber,
        role: role,
        address: address
    };
    addUser(newMember).then((response) => {
        alert(response.message);
    }).catch(() => {
        console.log('update');
        alert("Unexpected Error Occured !");
    });
    return false;
}
