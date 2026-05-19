let resumeData = null;
let currentLang = "ru";

document.addEventListener("DOMContentLoaded", () => {
  fetch("resume.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      resumeData = data;
      renderResume();
    })
    .catch((error) => {
      console.error(
        "There has been a problem with your fetch operation:",
        error,
      );
      document.body.innerHTML = `<div class="container py-5 text-center"><div class="alert alert-danger">Ошибка загрузки данных резюме.</div></div>`;
    });
});

function switchLanguage(lang) {
  currentLang = lang;

  // Update button states
  document.getElementById("lang-ru").classList.toggle("active", lang === "ru");
  document.getElementById("lang-en").classList.toggle("active", lang === "en");

  renderResume();
}

function renderResume() {
  if (!resumeData) return;
  const d = resumeData;
  const l = currentLang;

  // Static Headers Translation
  const headers = {
    ru: {
      about: "Обо мне",
      skills: "Навыки",
      experience: "Опыт работы",
      education: "Образование",
      projects: "Pet-проекты",
      extra: "Внеучебная деятельность",
      download: "Скачать PDF",
    },
    en: {
      about: "About Me",
      skills: "Skills",
      experience: "Work Experience",
      education: "Education",
      projects: "Pet Projects",
      extra: "Extracurricular Activities",
      download: "Download PDF",
    },
  };

  document.getElementById("header-about").textContent = headers[l].about;
  document.getElementById("header-skills").textContent = headers[l].skills;
  document.getElementById("header-experience").textContent =
    headers[l].experience;
  document.getElementById("header-education").textContent =
    headers[l].education;
  document.getElementById("header-projects").textContent = headers[l].projects;
  document.getElementById("header-extra").textContent = headers[l].extra;
  document.getElementById("btn-text").textContent = headers[l].download;

  // Personal Info
  document.getElementById("personal-photo").src = d.personal.photo;
  document.getElementById("personal-name").textContent = d.personal.name[l];
  document.getElementById("personal-quote").innerHTML = d.personal.quote[l];

  const contactsContainer = document.getElementById("personal-contacts");
  contactsContainer.innerHTML = `
        <div class="mb-1"><strong>e-mail:</strong> ${d.personal.email}</div>
        <div class="mb-1"><strong>number:</strong> ${d.personal.phone}</div>
        <div class="mb-1"><strong>telegram:</strong> <a href="https://t.me/${d.personal.telegram.replace("@", "")}" class="text-decoration-none text-muted">${d.personal.telegram}</a></div>
        <div class="mb-1"><strong>git:</strong> <a href="${d.personal.github}" class="text-decoration-none text-muted">${d.personal.github}</a></div>
    `;

  // Objective
  document.getElementById("objective-title").textContent = d.objective.title[l];
  document.getElementById("objective-text").innerHTML = d.objective.text[l];

  // Experience
  const experienceContainer = document.getElementById("experience-container");
  experienceContainer.innerHTML = "";
  if (d.experience && d.experience.length > 0) {
    d.experience.forEach((exp) => {
      const expDiv = document.createElement("div");
      expDiv.className = "mb-4";
      if (exp.disabled) expDiv.classList.add("item-disabled");
      expDiv.innerHTML = `
            <div class="row">
                <div class="col-3">
                    <div class="small text-muted fw-bold mb-1">${exp.period[l]}</div>
                    <div class="small text-muted italic">${exp.company[l]}</div>
                </div>
                <div class="col-9">
                    <div class="fw-bold text-dark mb-1">${exp.position[l]}</div>
                    <div class="text-dark small">${exp.description[l]}</div>
                </div>
            </div>
        `;
      experienceContainer.appendChild(expDiv);
    });
  } else {
    document.getElementById("header-experience").style.display = "none";
  }

  // Education
  const educationContainer = document.getElementById("education-container");
  educationContainer.innerHTML = "";
  d.education.forEach((edu) => {
    const eduDiv = document.createElement("div");
    eduDiv.className = "mb-3";
    if (edu.disabled) eduDiv.classList.add("item-disabled");
    eduDiv.innerHTML = `
            <div class="row">
                <div class="col-3 small text-muted fw-bold">${edu.period[l]}</div>
                <div class="col-9">
                    <div class="fw-bold text-dark">${edu.institution[l]}</div>
                    <div class="small text-dark">${edu.program[l]}</div>
                </div>
            </div>
        `;
    educationContainer.appendChild(eduDiv);
  });

  // Skills
  const skillsContainer = document.getElementById("skills-container");
  skillsContainer.innerHTML = "";
  d.skills.forEach((skill) => {
    const skillDiv = document.createElement("div");
    skillDiv.className = "mb-3";
    if (skill.disabled) skillDiv.classList.add("item-disabled");
    skillDiv.innerHTML = `
            <div class="fw-bold small text-uppercase text-secondary">${skill.category[l]}:</div>
            <div class="small">${skill.items}</div>
        `;
    skillsContainer.appendChild(skillDiv);
  });

  // Projects
  const projectsContainer = document.getElementById("projects-container");
  projectsContainer.innerHTML = "";
  d.projects.forEach((project) => {
    const projectDiv = document.createElement("div");
    projectDiv.className = "mb-4 position-relative";
    if (project.disabled) projectDiv.classList.add("item-disabled");
    projectDiv.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h5 class="fw-bold mb-0">${project.name[l]}</h5>
                <div class="d-flex gap-2 d-print-none">
                    ${
                      project.github
                        ? `
                        <a href="${project.github}" target="_blank" class="text-dark" title="View on GitHub">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-github" viewBox="0 0 16 16">
                                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8"/>
                            </svg>
                        </a>`
                        : ""
                    }
                    ${
                      project.website
                        ? `
                        <a href="${project.website}" target="_blank" class="text-dark" title="View Project Website">
                          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-arrow-up-right-square" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm5.854 8.803a.5.5 0 1 1-.708-.707L9.243 6H6.475a.5.5 0 1 1 0-1h3.975a.5.5 0 0 1 .5.5v3.975a.5.5 0 1 1-1 0V6.707z"/>
                          </svg>
                        </a>`
                        : ""
                    }
                </div>
            </div>
            <p class="small text-muted mb-2">${project.description[l]}</p>
            ${project.stack ? `<div class="small"><strong>${l === "ru" ? "Стэк технологий" : "Tech Stack"}:</strong> ${project.stack}</div>` : ""}
        `;
    projectsContainer.appendChild(projectDiv);
  });

  // Extracurricular
  const extraContainer = document.getElementById("extracurricular-container");
  extraContainer.innerHTML = "";
  d.extracurricular.forEach((group) => {
    const groupDiv = document.createElement("div");
    groupDiv.className = "mb-4";
    if (group.disabled) groupDiv.classList.add("item-disabled");

    let activitiesHtml = '<ul class="list-unstyled ms-1">';
    group.activities.forEach((activity) => {
      const text = activity[l];
      const isItemDisabled = activity.disabled;
      const formattedActivity = text.replace(/"([^"]+)"/g, "«$1»");

      let activityContent = formattedActivity;
      if (activity.href) {
        activityContent = `<a href="${activity.href}" target="_blank" class="text-decoration-none text-dark achievement-link">${formattedActivity}</a>`;
      }

      activitiesHtml += `<li class="mb-2 small ${isItemDisabled ? "item-disabled" : ""}">• ${activityContent}</li>`;
    });
    activitiesHtml += "</ul>";

    groupDiv.innerHTML = `
            <h5 class="fw-bold mb-3 text-secondary border-bottom pb-1" style="width: fit-content;">${group.year}:</h5>
            ${activitiesHtml}
        `;
    extraContainer.appendChild(groupDiv);
  });
}
