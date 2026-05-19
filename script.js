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
    projectDiv.className = "mb-4";
    if (project.disabled) projectDiv.classList.add("item-disabled");
    projectDiv.innerHTML = `
            <h5 class="fw-bold mb-2">${project.name[l]}</h5>
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
      activitiesHtml += `<li class="mb-2 small ${isItemDisabled ? "item-disabled" : ""}">• ${formattedActivity}</li>`;
    });
    activitiesHtml += "</ul>";

    groupDiv.innerHTML = `
            <h5 class="fw-bold mb-3 text-secondary border-bottom pb-1" style="width: fit-content;">${group.year}:</h5>
            ${activitiesHtml}
        `;
    extraContainer.appendChild(groupDiv);
  });
}
