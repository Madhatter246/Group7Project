
/*Data Storage*/
    const systemData = {
        citizens: [],
        admins: [],
        firstResponders: [],
        incidents: [],
        nextIncidentId: 1
    };

/*Initialize Demo Data*/
    function initializeDemoData() {
        systemData.incidents = [
            {
                id: 1,
                type: 'accident',
                location: 'Main Street & 5th Avenue',
                description: 'Car collision at intersection',
                reportedBy: 'john_doe',
                verified: true,
                viewed: true,
                damageLevel: 'high',
                fileNumber: 'INC-001',
                timestamp: new Date(Date.now() - 86400000)
            }
        ];
        systemData.nextIncidentId = 2;
    }
/*Function to open tabs*/
function Page(event,pageName) {
  /*Hide all elements with class="tabcontent" by default */
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  /*Remove the background color of all tablinks/buttons*/
  tablinks = document.getElementsByClassName("tablink");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].classList.remove("active");
  }

  /*Show the specific tab content*/
  document.getElementById(pageName).style.display = "block";
  /*add active class*/
  event.currentTarget.classList.add("active");
/*Update display based on the selected page*/
   if (pageName === "Admin") {
    console.log("Admin tab clicked - updating incidents");
      updateAdminIncidents();
      updateStats();
    } 

    if (pageName === "FirstResponder") {
       console.log("FirstResponder tab clicked - updating incidents")
       updateFirstResponderIncidents();
  }
}


// Incident Card Creator
function createIncidentCard(incident, role) {
    const timestamp = new Date(incident.timestamp).toLocaleString();
    const typeLabel = {
        accident: 'Traffic Accident',
        fire: 'Fire',
        theft: 'Theft',
        medical: 'Medical Emergency',
        vandalism: 'Vandalism',
        other: 'Other'
    }[incident.type] || incident.type;
    let actionButtons = '';

    if (role === 'admin') {
        actionButtons = `
            <div class="incident-actions">
                <button class="btn btn-success" onclick="verifyIncident(${incident.id})">
                    Verify
                </button>
                <button class="btn btn-danger" onclick="rejectIncident(${incident.id})">
                     Reject
                </button>
            </div>   
        `;
        } else if (role === 'FirstResponder') {
        actionButtons = `
            <div class="incident-actions">
                <button class="btn btn-primary" onclick="respondToIncident(${incident.id})">
                    Respond Now
                </button>
                <button class="btn btn-secondary" onclick="markViewed(${incident.id})">
                    Mark Viewed
                </button>
            </div>
        `;
    }
    return `
        <div class="incident-card">
            <div class="incident-header">
                <div class="incident-title">${typeLabel}</div>
                <div>
                    ${!incident.verified ? '<span class="incident-badge badge-pending">PENDING</span>' : ''}
                    ${incident.verified ? '<span class="incident-badge badge-verified">VERIFIED</span>' : ''}
                    ${incident.viewed ? '<span class="incident-badge badge-viewed">VIEWED</span>' : ''}
                </div>
            </div>
            <div class="incident-details">
                <div class="detail-item">
                    <div class="detail-label">File Number</div>
                    <div class="detail-value">${incident.fileNumber}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Location</div>
                    <div class="detail-value">${incident.location}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Reported By</div>
                    <div class="detail-value">${incident.reportedBy}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Time</div>
                    <div class="detail-value">${timestamp}</div>
                </div>
                <div class="detail-item" style="grid-column: 1 / -1;">
                    <div class="detail-label">Description</div>
                    <div class="detail-value">${incident.description}</div>
                </div>
            </div>
            ${actionButtons}
        </div>
    `;
}


  
/*Update functions-citizen*/
function updateCitizenIncidents() {
    const container = document.getElementById('citizen-incidents');
    const username = document.getElementById('citizen-username').value;

    if (systemData.incidents.length === 0) {
        container.innerHTML = `
        <div class="empty-state">
            <div class="empty-state-icon">📋</div>
            <p>No incidents reported yet</p>
        </div>`;
        return;
    }

    const userIncidents = systemData.incidents.filter(i =>
        i.reportedBy === username
    );


    container.innerHTML =
    `<h3>${systemData.incidents.length} Incident(s) Reported</h3>` +
    systemData.incidents.map(incident =>
        createIncidentCard(incident, 'citizen')
    ).join('');
}

function updateAdminIncidents() {
    const container = document.getElementById('Admin-incidents');
    console.log("Total incidents in system:", systemData.incidents.length);

    if (systemData.incidents.length === 0) {
        container.innerHTML = `
  <div class="empty-state">
    <div class="empty-state-icon">🗂️</div>
    <p>No incidents reported yet</p>
  </div>`;
        return;
    }

    const html = systemData.incidents.map(incident =>
        createIncidentCard(incident, 'admin')
    ).join('');
    
    console.log("Generated HTML:", html);
    container.innerHTML = html;
}

function updateFirstResponderIncidents() {
    const container = document.getElementById('FirstResponder-incidents');
console.log("FirstResponder updating...");
console.log(systemData.incidents);
    const verifiedIncidents = systemData.incidents;

    if (verifiedIncidents.length === 0) {
        container.innerHTML = `
  <div class="empty-state">
    <div class="empty-state-icon">🛡️</div>
    <p>No verified incidents</p>
  </div>`;
        return;
    }

    container.innerHTML = verifiedIncidents.map(incident =>
        createIncidentCard(incident, 'FirstResponder')
    ).join('');
}

/* Admin Action Functions */
function verifyIncident(incidentId) {
    const incident = systemData.incidents.find(i => i.id === incidentId);
    if (incident) {
        incident.verified = true;
        showMessage('Incident verified successfully!', 'success');
        updateDisplay();
    }
}

function rejectIncident(incidentId) {
    if (confirm('Are you sure you want to reject this incident?')) {
        systemData.incidents = systemData.incidents.filter(i => i.id !== incidentId);
        showMessage('Incident rejected', 'success');
        updateDisplay();
    }
}
/* First Responder Action Functions */
function markViewed(incidentId) {
    const incident = systemData.incidents.find(i => i.id === incidentId);
    if (incident) {
        incident.viewed = true;
        showMessage('Marked as viewed', 'success');
        updateDisplay();
    }
}

/* First Responder Functions */
function respondToIncident(incidentId) {
    const incident = systemData.incidents.find(i => i.id === incidentId);
    if (incident) {
        showMessage(`Responding to ${incident.type} at ${incident.location}`, 'success');
    }
}

/*Stats Update */ 
function updateStats() {
    const totalIncidents = systemData.incidents.length;
    const pendingIncidents = systemData.incidents.filter(i => !i.verified).length;
    const verifiedIncidents = systemData.incidents.filter(i => i.verified).length;

    document.getElementById('total-incidents').textContent = totalIncidents;
    document.getElementById('pending-incidents').textContent = pendingIncidents;
    document.getElementById('verified-incidents').textContent = verifiedIncidents;
}

/*Form Submission Handler*/
document.getElementById('citizen-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newIncident = {
            id: systemData.nextIncidentId,
            type: document.getElementById('incident-type').value,
            location: document.getElementById('incident-location').value,
            description: document.getElementById('incident-description').value,
            reportedBy: document.getElementById('citizen-username').value,
            verified: false,
            viewed: false,
            damageLevel: 'unknown',
            fileNumber: `INC-${String(systemData.nextIncidentId).padStart(3, '0')}`,  // 
            timestamp: new Date()
        };
        
        systemData.incidents.push(newIncident);
        showMessage('Incident reported successfully!', 'success');
        this.reset();
        updateDisplay();
    });

/*Notification Function when report is sumbitted*/
function showMessage(message, type = "success") {

    /*Create overlay*/
    let overlay = document.createElement("div");
    overlay.className = "notification-overlay";

    /*Create notification*/
    let notif = document.createElement("div");
    notif.className = `notification ${type}`;
    notif.textContent = message;

    document.body.appendChild(overlay);
    document.body.appendChild(notif);

   overlay.addEventListener("click", () => {
      notif.remove();
      overlay.remove();
    });
   
    /*Animate in*/
    setTimeout(() => {
        overlay.classList.add("show");
        notif.classList.add("show");
    }, 50);

    /*Remove after 3 seconds*/
    setTimeout(() => {
        notif.classList.remove("show");
        overlay.classList.remove("show");

        setTimeout(() => {
            notif.remove();
            overlay.remove();
        }, 300);
    }, 3000);
}


/*Display Update Functions*/
    function updateDisplay() {
        updateCitizenIncidents();
        updateAdminIncidents();
        updateFirstResponderIncidents();
        updateStats();
    }

    /*Tabs management for the admin section*/
const tabs = document.querySelectorAll(".tab");
const tabContents = document.querySelectorAll(".tab-content");

tabs.forEach(tab => {
    tab.addEventListener("click", () => {

        /*Remove active class from all tabs*/
        tabs.forEach(t => t.classList.remove("active"));

        /*Hide all tab contents*/
        tabContents.forEach(content => content.classList.remove("active"));

        /*Activate clicked tab*/
        tab.classList.add("active");

        /*Show the correct tab content*/
        const tabName = tab.getAttribute("data-tab");
        document.getElementById(tabName + "-tab").classList.add("active");
        updateFirstResponderIncidents();
    });
});

/*Loading screen function*/
window.addEventListener("load", function () {
    const loader = document.getElementById("loading-screen");
    
    setTimeout(() => {
        loader.style.transition = "opacity 0.6s ease";
        loader.style.opacity = "0";

        setTimeout(() => {
            loader.style.display = "none";
        }, 600);
    }, 2000); // matches progress bar timing
  document.getElementById("defaultOpen").click();
  });
  initializeDemoData();
  updateDisplay();
  

/* Get the element with id="defaultOpen" and click on it */


////////////////////////////*Event Listeners*/





