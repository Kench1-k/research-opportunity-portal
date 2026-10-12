// public/app.js
const API_URL = '/api/opportunities';

document.addEventListener('DOMContentLoaded', () => {
    fetchOpportunities();
    document.getElementById('opportunityForm').addEventListener('submit', handleFormSubmit);
});

// Alert helper
function showAlert(message, type = 'success') {
    const alertContainer = document.getElementById('alertContainer');
    alertContainer.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    setTimeout(() => {
        const alert = document.querySelector('.alert');
        if (alert) alert.remove();
    }, 4000);
}

// 1. GET ALL
async function fetchOpportunities() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('Failed to fetch opportunities');
        const data = await res.json();
        renderGrid(data);
    } catch (err) {
        showAlert(err.message, 'danger');
    }
}

// Render cards
function renderGrid(items) {
    const grid = document.getElementById('opportunitiesGrid');
    grid.innerHTML = '';

    if (items.length === 0) {
        grid.innerHTML = `<div class="col-12 text-center text-muted py-5"><p>No research opportunities available.</p></div>`;
        return;
    }

    items.forEach(item => {
        const dateStr = new Date(item.application_deadline).toLocaleDateString();
        const badge = item.status === 'Open' 
            ? '<span class="badge bg-success">Open</span>' 
            : '<span class="badge bg-secondary">Closed</span>';

        grid.innerHTML += `
            <div class="col-md-6 col-lg-4">
                <div class="card card-hover h-100 shadow-sm border-0">
                    <div class="card-body d-flex flex-column">
                        <div class="d-flex justify-content-between mb-2">
                            <span class="badge bg-info text-dark">${escapeHtml(item.research_area)}</span>
                            ${badge}
                        </div>
                        <h5 class="card-title text-primary font-weight-bold">${escapeHtml(item.title)}</h5>
                        <h6 class="card-subtitle text-muted mb-2">${escapeHtml(item.faculty_name)} (${escapeHtml(item.department)})</h6>
                        <p class="card-text text-secondary flex-grow-1">${escapeHtml(item.description.substring(0, 100))}...</p>
                        <div class="small text-muted mb-3">
                            <div><strong>Positions:</strong> ${item.available_positions}</div>
                            <div><strong>Deadline:</strong> ${dateStr}</div>
                        </div>
                        <div class="border-top pt-2 d-flex gap-1 flex-wrap">
                            <button class="btn btn-sm btn-outline-primary" onclick="viewOpportunity(${item.id})">View</button>
                            <button class="btn btn-sm btn-outline-warning" onclick="editOpportunity(${item.id})">Edit</button>
                            ${item.status === 'Open' ? 
                                `<button class="btn btn-sm btn-outline-secondary" onclick="toggleStatus(${item.id}, 'Closed')">Close</button>` : 
                                `<button class="btn btn-sm btn-outline-success" onclick="toggleStatus(${item.id}, 'Open')">Reopen</button>`
                            }
                            <button class="btn btn-sm btn-outline-danger ms-auto" onclick="deleteOpportunity(${item.id})">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
}

// 2. GET ONE
async function viewOpportunity(id) {
    try {
        const res = await fetch(`${API_URL}/${id}`);
        if (!res.ok) throw new Error('Opportunity not found');
        const item = await res.json();

        document.getElementById('viewTitle').innerText = item.title;
        document.getElementById('viewModalBody').innerHTML = `
            <p><strong>Faculty:</strong> ${escapeHtml(item.faculty_name)} (${escapeHtml(item.department)})</p>
            <p><strong>Area:</strong> ${escapeHtml(item.research_area)}</p>
            <p><strong>Skills Required:</strong> ${escapeHtml(item.required_skills)}</p>
            <p><strong>Positions:</strong> ${item.available_positions}</p>
            <p><strong>Deadline:</strong> ${new Date(item.application_deadline).toLocaleDateString()}</p>
            <p><strong>Status:</strong> ${item.status}</p>
            <hr>
            <p>${escapeHtml(item.description)}</p>
        `;
        new bootstrap.Modal(document.getElementById('viewModal')).show();
    } catch (err) {
        showAlert(err.message, 'danger');
    }
}

// 3. CREATE / UPDATE FORM HANDLER
async function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;

    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
    }

    const id = document.getElementById('opportunityId').value;
    const payload = {
        title: document.getElementById('title').value,
        faculty_name: document.getElementById('faculty_name').value,
        department: document.getElementById('department').value,
        research_area: document.getElementById('research_area').value,
        available_positions: parseInt(document.getElementById('available_positions').value),
        status: document.getElementById('status').value,
        application_deadline: document.getElementById('application_deadline').value,
        required_skills: document.getElementById('required_skills').value,
        description: document.getElementById('description').value
    };

    const isEdit = !!id;
    const url = isEdit ? `${API_URL}/${id}` : API_URL;
    const method = isEdit ? 'PUT' : 'POST';

    try {
        const res = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Action failed');

        showAlert(isEdit ? 'Opportunity updated!' : 'Opportunity created!');
        bootstrap.Modal.getInstance(document.getElementById('opportunityModal')).hide();
        resetForm();
        fetchOpportunities();
    } catch (err) {
        showAlert(err.message, 'danger');
    }
}

// 4. PREFILL EDIT FORM
async function editOpportunity(id) {
    try {
        const res = await fetch(`${API_URL}/${id}`);
        const item = await res.json();

        document.getElementById('opportunityId').value = item.id;
        document.getElementById('title').value = item.title;
        document.getElementById('faculty_name').value = item.faculty_name;
        document.getElementById('department').value = item.department;
        document.getElementById('research_area').value = item.research_area;
        document.getElementById('available_positions').value = item.available_positions;
        document.getElementById('status').value = item.status;
        document.getElementById('application_deadline').value = new Date(item.application_deadline).toISOString().split('T')[0];
        document.getElementById('required_skills').value = item.required_skills;
        document.getElementById('description').value = item.description;

        document.getElementById('modalTitle').innerText = `Edit Opportunity #${item.id}`;
        new bootstrap.Modal(document.getElementById('opportunityModal')).show();
    } catch (err) {
        showAlert('Could not load details for editing', 'danger');
    }
}

// 5. TOGGLE STATUS
async function toggleStatus(id, newStatus) {
    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
        if (!res.ok) throw new Error('Failed to update status');
        showAlert(`Status changed to ${newStatus}`);
        fetchOpportunities();
    } catch (err) {
        showAlert(err.message, 'danger');
    }
}

// 6. DELETE
async function deleteOpportunity(id) {
    if (!confirm(`Are you sure you want to delete opportunity #${id}?`)) return;

    try {
        const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Delete failed');

        showAlert(`Opportunity #${id} deleted.`);
        fetchOpportunities();
    } catch (err) {
        showAlert(err.message, 'danger');
    }
}

function resetForm() {
    const form = document.getElementById('opportunityForm');
    form.reset();
    form.classList.remove('was-validated');
    document.getElementById('opportunityId').value = '';
    document.getElementById('modalTitle').innerText = 'Post Research Opportunity';
}

function escapeHtml(str) {
    return str ? str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : '';
}