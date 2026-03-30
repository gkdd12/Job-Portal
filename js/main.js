//making logout element
const logout = document.createElement("a");
logout.textContent = 'Logout';
logout.addEventListener('click' , () => {
    sessionStorage.setItem("loginFlag",0);
});

function loginSubmit(event){
    const userId = document.querySelector('input[type="text"]').value;
    const password = document.querySelector('input[type="password"]').value;

    if (userId === "" || password === "") {
        alert("Please fill in all fields before logging in!");
        event.preventDefault(); // This stops the page from changing to dashboard.html
        //here we use event due to above line it doesn't know which one
    } else {
        sessionStorage.setItem("loginFlag",1);
        alert("Welcome, " + userId + "! Logging you in...");
    }
}

function registerSubmit(event){
    const phoneNumber = document.querySelector('input[type="tel"]').value;
    const allTexts = document.querySelectorAll('input[type="text"]');
    const name = allTexts[0].value;
    const nationality = allTexts[1].value;
    const gmail = document.querySelector('input[type="email"]').value;
    const userID = allTexts[2].value;
    const passwordsArray = document.querySelectorAll('input[type="password"]');
    const password = passwordsArray[0].value;
    const confirmPassword = passwordsArray[1].value;
    if(name === "" || nationality === "" || gmail === "" || phoneNumber.trim().length != 10 || userID === ""){
        if(phoneNumber.trim().length != 10){
            alert("Please fill in all fields and phone number length should be 10");
        }else{
            alert("Please fill in all fields");
        }
        event.preventDefault();
    }else{
        if(password === "" || confirmPassword === ""){
            alert("please enter the passwords");
            event.preventDefault();
        }else if(password != confirmPassword){
            alert("password and confirm password should be same");
            event.preventDefault();
        }
        // else{
        //     alert("u successful registered");
        // }
    }
}

function postJob(event){
    event.preventDefault();//it prevents the reload the page, it is faster than windw.loc.href

    const allTexts = document.querySelectorAll('input[type="text"]');
    const jobTitle = allTexts[0].value;
    const company = allTexts[1].value;
    const salary = document.querySelector('input[type="number"]').value;
    //location
    const locElement = document.querySelector('input[name="location"]:checked');
    const loc = locElement ? locElement.value : "";
    //job type
    const jobType = document.querySelector('option:checked').text;
    const skills = document.querySelector('textarea').value;
    if(jobTitle === "" || company === "" || salary.length == 0 || loc === "" || jobType === "" || skills === ""){
        alert("please fill all the texts");
    }else{
        alert("u suceesfully post a job");
        let j = {
            title:jobTitle,
            comp:company,
            payment:salary,
            type:jobType
        };
        sessionStorage.setItem('job', JSON.stringify(j));
        window.location.href = "jobs.html";
    }
}

function showJobDetails(jobId) {
    // This sends the user to job-details.html?id=FSD
    window.location.href = "job-details.html?id=" + jobId;
}

function companyFilter(company){
    window.location.href = "jobs.html?company=" + company;
}

function createLocationField(){
    if(!document.getElementById('workLocation')){
    const locationInput = document.createElement("input");
    locationInput.type="text";
    locationInput.id="workLocation";
    document.getElementById('locationField').appendChild(locationInput);
    }
}

function deleteLocationField(){
    document.getElementById('workLocation').remove();
    //the above removes the field
}

// Add this logic to run when the Job Details page loads
window.addEventListener('DOMContentLoaded', () => {
    // Check if we are on the job-details page

    const pathway = window.location.pathname;
    const params = new URLSearchParams(window.location.search);

    //add logout
    if(sessionStorage.getItem("loginFlag") === '1'){
    const navigation = document.querySelector('nav');
    // const logout = document.createElement("a");
    logout.href = pathway;
    // logout.textContent = 'Logout';
    // logout.addEventListener('click' , () => {
    //     sessionStorage.setItem("loginFlag",1);
    // });
    navigation.appendChild(logout);}

    switch(true){
        case pathway.includes("job-details.html"):
            const jobIdToShow = params.get('id');

            if (jobIdToShow) {
            // 1. Hide all detail divs first
            // const allDetails = document.querySelectorAll('.details');
            // allDetails.forEach(div => div.style.display = 'none');

            // 2. Show only the one that matches the ID from the URL
                const targetDiv = document.getElementById(jobIdToShow);
                if (targetDiv) {
                    targetDiv.style.display = 'block';
                }
            }else{
                const allDetails = document.querySelectorAll('.details');
                allDetails.forEach(div => div.style.display = 'block');
            }

        case pathway.includes("jobs.html"):
            const company = params.get('company');
        
            if(sessionStorage.getItem("loginFlag") === '1'){
                //hiding
                const links = document.querySelectorAll("nav a");//to target nav
                links[0].style.display = 'none';
                links[1].style.display = 'none';
            }

            if(company){
            // Hide all cards
                const allCards = document.querySelectorAll('.card');
                allCards.forEach(card => card.style.display = 'none');

            // Find the p tag with the company ID, then show its parent .card
                const companyLabel = document.getElementById(company);
                if (companyLabel) {
                    companyLabel.parentElement.style.display = 'block';
                }
            }else{
                const container = document.getElementById("jobContainer");
    
                const tjob = JSON.parse(sessionStorage.getItem('job'));
            
                const jobCard = document.createElement("div");
                jobCard.className = "card";
            //
                const title = document.createElement("h3");
                title.textContent = tjob.title;
                const company = document.createElement("p");
                company.textContent = tjob.comp;
                const salary = document.createElement("p");
                salary.textContent = "Salary: " + tjob.payment + " per month";
                const type = document.createElement("p");
                type.textContent = tjob.type;
                const deatilsButton = document.createElement("button");
                deatilsButton.textContent = "view details";
                deatilsButton.addEventListener('click',function() {
                showJobDetails(tjob.title);
                })

                jobCard.append(title, company, salary, type, deatilsButton);
                container.appendChild(jobCard);
            }

        case pathway.includes("index.html"):
            if(sessionStorage.getItem("loginFlag") === '1'){
            //hiding
                const links = document.querySelectorAll("nav a");//to target nav
                links[0].style.display = 'none';
                links[1].style.display = 'none';
            }
    }
});