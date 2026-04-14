//making logout element
const logout = document.createElement("a");
logout.textContent = 'Logout';
logout.addEventListener('click' , () => {
    sessionStorage.setItem("loginFlag",0);
    alert("u successfully logout");
    window.location.href="index.html";
});
const dashboard = document.createElement("a");
dashboard.textContent='DashBoard';
dashboard.href='dashboard.html';

async function loginSubmit(event){
    const userId = document.querySelector('input[type="text"]').value;
    const password = document.querySelector('input[type="password"]').value;

    if (userId === "" || password === "") {
        alert("Please fill in all fields before logging in!");
        event.preventDefault(); // This stops the page from changing to dashboard.html
        //here we use event due to above line it doesn't know which one
    } else {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ userId, password })
        });
        const data = await response.json();
        if (data.success) {
            alert(data.message);sessionStorage.setItem("loginFlag",1);
            sessionStorage.setItem("userName",userId);
            window.location.href = data.redirect; // Send them to dashboard
        } else {
            alert(data.message); // Show "Invalid password!" or "User not found!"
        }
    }
}

async function registerSubmit(event){
    const phoneNumber = document.querySelector('input[type="tel"]').value;
    const allTexts = document.querySelectorAll('input[type="text"]');
    const name = allTexts[0].value;
    const nationality = allTexts[1].value;
    const gmail = document.querySelector('input[type="email"]').value;
    const userId = allTexts[2].value;
    const passwordsArray = document.querySelectorAll('input[type="password"]');
    const password = passwordsArray[0].value;
    const confirmPassword = passwordsArray[1].value;
    if(name === "" || nationality === "" || gmail === "" || phoneNumber.trim().length != 10 || userId === ""){
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
        else{
            const response = await fetch('/register' , {
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({name,phoneNumber,nationality,gmail,userId,password})
            });
            const data = await response.json();
            if(data.success){
                alert(data.message);
                window.location.href = data.redirect;
            }else{
                alert(data.message);
            }
        }
    }
}

async function postJob(event){
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
        let workLocation = "";
        //it changes so we use let
        if(loc === "work place"){ 
            const locationInputField = document.getElementById("workLocation");
        
        if (!locationInputField || locationInputField.value.trim() === "") {
            alert("Please fill in the specific workplace location");
            return; 
        }
        workLocation = locationInputField.value;
            //the above !locInputField is like safty if it not opened so that like precaution
        }else if(loc === "Remote"){workLocation=loc;}
        const location = workLocation;
        const resp =await fetch('/jobPost' , {
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({jobTitle,company,salary,location,jobType,skills})
        });
        const res_data = await resp.json();
        if(res_data.success){
            alert(res_data.message);
            window.location.href = res_data.directLink;
        }else{
            alert(res_data.message);
        }
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

function createDetail(detail){
    const dCard = document.createElement("div");
    dCard.className="details";
    const role = document.createElement("p");
    role.textContent="Role:"+detail.jobTitle;
    const com = document.createElement("p");
    com.textContent="Company:"+detail.company;
    const pay = document.createElement("p");
    pay.textContent="Salary:"+detail.salary;
    const du = document.createElement("p");
    du.textContent=detail.jobType;
    const s = document.createElement("p");
    s.textContent="Skills:";
    const list = document.createElement("ul"); 
    //Split the skills string by commas and newlines
    // This regex splits by comma OR newline and removes extra spaces
    const skillsArray = detail.skills.split(/[,\n]/);
    // creating <li> for each skill
    skillsArray.forEach(skillText => {
        const trimmedSkill = skillText.trim();
        if (trimmedSkill !== "") { // Avoid empty bullet points
            const li = document.createElement("li");
            li.textContent = trimmedSkill;
            list.appendChild(li);
        }
    });
    dCard.append(role,com,pay,du,s,list);
    return dCard;
}

function createJobBox(tjob,container){
    const jobCard = document.createElement("div");
    jobCard.className = "card";
    const title = document.createElement("h3");
    title.textContent = tjob.jobTitle;
    const company = document.createElement("p");
    company.textContent = tjob.company;
    const salary = document.createElement("p");
    salary.textContent = "Salary: " + tjob.salary + " per month";
    const type = document.createElement("p");
    type.textContent = tjob.jobType;
    const deatilsButton = document.createElement("button");
    deatilsButton.textContent = "view details";
    deatilsButton.addEventListener('click',function() {
    showJobDetails(tjob.jobTitle);
    })
    jobCard.append(title, company, salary, type, deatilsButton);
    container.appendChild(jobCard);
}

async function createCompanyDirectory(){
    const tableConatiner = document.getElementById("companyTable");
    const response = await fetch('/company',{
        method:'GET',
        // headers:{'Content-type' : 'application/json'} //it is for when sends a data from here
    });
    const data = await response.json();
    if(response.ok){
        for(const companyDetail of data){
            const tr = document.createElement("tr");
            tr.onclick=() => companyFilter(companyDetail.company);
            tr.style.cursor="pointer";
            const td1 = document.createElement("td");
            td1.textContent=companyDetail.company;
            const td2 = document.createElement("td");
            td2.textContent=companyDetail.location;
            const td3 = document.createElement("td");
            td3.textContent=companyDetail.noOfPosts;
            tr.append(td1,td2,td3);
            tableConatiner.appendChild(tr);
        }
    }else{
        alert("we unable to load");
    }
}

async function createMyPosts(){
    const cont = document.getElementById("myPostedJobs");
    const resp = await fetch('/myPosts',{
        method:'GET',
        header:{'Content-type' : 'application-json'},
        body:json.stringify(sessionStorage.getItem("userName"))
    });
    if(resp.ok){
    const data = await resp.json();
    for(posts in data){
        const post = document.createElement("div");
        const title = document.createElement("h3");
        title.textContent = posts.jobTitle;
        const salary = document.createElement("p");
        salary.textContent = posts.salary;
        const update = document.createElement("button");
        update.textContent = "Update Post";
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "delete Post";
        post.append(title,salary,update,deleteButton);
        cont.appendChild(post);
    }}else{
        alert("unable to fetch");
    }
}

// Add this logic to run when the Job Details page loads
window.addEventListener('DOMContentLoaded', async () => {
    // Check if we are on the job-details page

    const pathway = window.location.pathname;
    const params = new URLSearchParams(window.location.search);

    //add logout
    if(sessionStorage.getItem("loginFlag") === '1'){
    const navigation = document.querySelector('nav');
    // const logout = document.createElement("a");
    if(!(pathway.includes("dashboard.html")||pathway.includes("post-job.html"))){logout.href = pathway;}
    else{logout.href="index.html";}
    // logout.textContent = 'Logout';
    // logout.addEventListener('click' , () => {
    //     sessionStorage.setItem("loginFlag",1);
    // });
    if(!pathway.includes("dashboard.html")){navigation.appendChild(dashboard);}
    navigation.appendChild(logout);}

    switch(true){
        case pathway.includes("job-details.html"):
            const jobId = params.get('id');
            const response = await fetch(`/jobDetails?id=${jobId}`,{
                method:'GET',
                headers: {'Content-Type': 'application/json'}
            });
            if(response.ok){
                const details = await response.json();
                const jobDetail = createDetail(details);
                const container = document.getElementById("Detailss");
                container.appendChild(jobDetail);
            }else{
                alert("unsuccessful fetch the details");
            }
            break;

        case pathway.includes("jobs.html"):
        const company = params.get('company');
        const container = document.getElementById("jobContainer");
    
        // Construct the URL
        const url = company ? `/jobs?company=${company}` : '/jobs';
    
        const resp = await fetch(url, { method: 'GET' });
    
        if(resp.ok) {
            const jobsList = await resp.json();
            //container.innerHTML = ""; // Clear existing jobs
            for(const tjob of jobsList) {
                createJobBox(tjob, container);
            }
        } else {
            alert("Fetch failed");
        }
        break;

        case pathway.includes("index.html"):
            if(sessionStorage.getItem("loginFlag") === '1'){
            //hiding
                const links = document.querySelectorAll("nav a");//to target nav
                links[0].style.display = 'none';
                links[1].style.display = 'none';
            }
            break;

        case pathway.includes("companies.html"):
            createCompanyDirectory();
            break;

        case pathway.includes("dashboard.html"):
            createMyPosts();
            break;
    }
});