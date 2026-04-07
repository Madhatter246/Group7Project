
    // Data Storage
    const systemData = {
        citizens: [],
        admins: [],
        firstResponders: [],
        incidents: [],
        nextIncidentId: 1
    };

    // Initialize Demo Data
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

    // User Role Management
    const userButtons = document.querySelectorAll('.user-option');
    userButtons.forEach(button => {
        button.addEventListener('click', function() {
            userButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const role = this.dataset.role;
            const sections = document.querySelectorAll('.section');
            sections.forEach(section => section.classList.remove('active'));
            
            const sectionId = `${role}-section`;  //
            document.getElementById(sectionId).classList.add('active');
            
            updateDisplay();
        });
    });

    // Tab Management
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            document.getElementById(`${tabName}-tab`).classList.add('active');  
            updateDisplay();
        });
    });

    // Citizen Form Submission
    document.getElementById('citizen-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newIncident = {
            id: systemData.nextIncidentId++,
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

    // Display Update Functions
    function updateDisplay() {
        updateCitizenIncidents();
        updateAdminIncidents();
        updateFirstResponderIncidents();
        updateStats();
    }

    function updateCitizenIncidents() {
        const container = document.getElementById('citizen-incidents');
        const userIncidents = systemData.incidents.filter(i => 
            i.reportedBy === document.getElementById('citizen-username').value
        );
        
        if (userIncidents.length === 0) {
            container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📋</div><p>No incidents reported yet</p></div>';
            return;
        }
        
        container.innerHTML = '<h3 style="margin-top: 30px; margin-bottom: 20px;">Your Reports</h3>' + 
            userIncidents.map(incident => createIncidentCard(incident, 'citizen')).join('');
    }

    function updateAdminIncidents() {
        const container = document.getElementById('admin-incidents');
        
        if (systemData.incidents.length === 0) {
            container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📭</div><p>No incidents to verify</p></div>';
            return;
        }
        
        container.innerHTML = systemData.incidents.map(incident => 
            createIncidentCard(incident, 'admin')
        ).join('');
    }

    function updateFirstResponderIncidents() {
        const container = document.getElementById('first-responder-incidents');
        const verifiedIncidents = systemData.incidents.filter(i => i.verified);
        
        if (verifiedIncidents.length === 0) {
            container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">✅</div><p>No verified incidents to respond to</p></div>';
            return;
        }
        
        container.innerHTML = verifiedIncidents.map(incident => 
            createIncidentCard(incident, 'first-responder')
        ).join('');
    }

    function updateStats() {
        document.getElementById('total-incidents').textContent = systemData.incidents.length;
        document.getElementById('pending-incidents').textContent = 
            systemData.incidents.filter(i => !i.verified).length;
        document.getElementById('verified-incidents').textContent = 
            systemData.incidents.filter(i => i.verified).length;
    }

    function createIncidentCard(incident, role) {
        let actions = '';
        
        if (role === 'admin') {
            const buttonText = incident.verified ? 'Verified ✓' : 'Verify';
            const buttonClass = incident.verified ? 'btn-success' : 'btn-primary';
            actions = `
                <div class="incident-actions">
                    <button class="btn ${buttonClass}" onclick="toggleVerification(${incident.id})" 
                        ${incident.verified ? 'disabled' : ''}>
                        ${buttonText}
                    </button>
                </div>
            `;
        } else if (role === 'first-responder') {
            actions = `
                <div class="incident-actions">
                    <button class="btn btn-success" onclick="markAsViewed(${incident.id})">
                        Mark as Viewed
                    </button>
                </div>
            `;
        }
        
        const verifiedBadge = incident.verified ? '<span class="incident-badge badge-verified">Verified</span>' : 
            '<span class="incident-badge badge-pending">Pending</span>';
        const viewedBadge = incident.viewed ? '<span class="incident-badge badge-viewed">Viewed</span>' : '';
        
        return `
            <div class="incident-card">
                <div class="incident-header">
                    <div class="incident-title">Incident #${incident.fileNumber}</div>
                    <div>
                        ${verifiedBadge}
                        ${viewedBadge}
                    </div>
                </div>
                <div class="incident-details">
                    <div class="detail-item">
                        <div class="detail-label">Type</div>
                        <div class="detail-value">${capitalizeText(incident.type)}</div>
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
                        <div class="detail-label">Date & Time</div>
                        <div class="detail-value">${incident.timestamp.toLocaleString()}</div>
                    </div>
                </div>
                <div class="detail-item" style="margin-bottom: 15px;">
                    <div class="detail-label">Description</div>
                    <div class="detail-value">${incident.description}</div>
                </div>
                ${actions}
            </div>
        `;
    }

    function toggleVerification(incidentId) {
        const incident = systemData.incidents.find(i => i.id === incidentId);
        if (incident) {
            incident.verified = !incident.verified;
            showMessage(`Incident ${incident.verified ? 'verified' : 'unverified'}!`, 'success');  // ✅ FIXED
            updateDisplay();
        }
    }

    function markAsViewed(incidentId) {
        const incident = systemData.incidents.find(i => i.id === incidentId);
        if (incident) {
            incident.viewed = true;
            showMessage('Incident marked as viewed!', 'success');
            updateDisplay();
        }
    }

    function showMessage(text, type) {
        const container = document.querySelector('.content');
        const message = document.createElement('div');
        message.className = `message ${type}`;  // ✅ FIXED
        message.textContent = text;
        container.insertBefore(message, container.firstChild);
        
        setTimeout(() => message.remove(), 4000);
    }

    function capitalizeText(text) {
        return text.charAt(0).toUpperCase() + text.slice(1).replace(/[-_]/g, ' ');
    }

    // Initialize
    initializeDemoData();
    updateDisplay();
