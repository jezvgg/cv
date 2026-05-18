document.addEventListener("DOMContentLoaded", () => {
  fetch("resume.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      renderResume(data);
    })
    .catch((error) => {
      console.error(
        "There has been a problem with your fetch operation:",
        error,
      );
      document.body.innerHTML = `<div class="container py-5 text-center"><div class="alert alert-danger">Ошибка загрузки данных резюме. Пожалуйста, убедитесь, что вы запустили локальный сервер.</div></div>`;
    });
});

function renderResume(data) {
  // Personal Info
  document.getElementById("personal-photo").src = data.personal.photo;
  document.getElementById("personal-name").textContent = data.personal.name;
  document.getElementById("personal-quote").textContent = data.personal.quote;

  const contactsContainer = document.getElementById("personal-contacts");
  contactsContainer.innerHTML = `
        <div class="mb-1"><strong>e-mail:</strong> ${data.personal.email}</div>
        <div class="mb-1"><strong>number:</strong> ${data.personal.phone}</div>
        <div class="mb-1"><strong>telegram:</strong> <a href="https://t.me/${data.personal.telegram.replace("@", "")}" class="text-decoration-none text-muted">${data.personal.telegram}</a></div>
        <div class="mb-1"><strong>git:</strong> <a href="${data.personal.github}" class="text-decoration-none text-muted">${data.personal.github}</a></div>
    `;

  // Objective
  document.getElementById("objective-title").textContent = data.objective.title;
  document.getElementById("objective-text").textContent = data.objective.text;

  // Education
  const educationContainer = document.getElementById("education-container");
  data.education.forEach((edu) => {
    const eduDiv = document.createElement("div");
    eduDiv.className = "mb-3";
    eduDiv.innerHTML = `
            <div class="row">
                <div class="col-md-3 small text-muted fw-bold">${edu.period}</div>
                <div class="col-md-9">
                    <div class="fw-bold">${edu.institution}</div>
                    <div class="small">${edu.program}</div>
                </div>
            </div>
        `;
    educationContainer.appendChild(eduDiv);
  });

  // Skills
  const skillsContainer = document.getElementById("skills-container");
  data.skills.forEach((skill) => {
    const skillDiv = document.createElement("div");
    skillDiv.className = "mb-3";
    skillDiv.innerHTML = `
            <div class="fw-bold small text-uppercase text-secondary">${skill.category}:</div>
            <div class="small">${skill.items}</div>
        `;
    skillsContainer.appendChild(skillDiv);
  });

  // Projects
  const projectsContainer = document.getElementById("projects-container");
  data.projects.forEach((project) => {
    const projectDiv = document.createElement("div");
    projectDiv.className = "mb-4";
    projectDiv.innerHTML = `
            <h5 class="fw-bold mb-2">${project.name}</h5>
            <p class="small text-muted mb-2">${project.description}</p>
            ${project.stack ? `<div class="small"><strong>Стэк технологий:</strong> ${project.stack}</div>` : ""}
        `;
    projectsContainer.appendChild(projectDiv);
  });

  // Extracurricular
  const extraContainer = document.getElementById("extracurricular-container");
  data.extracurricular.forEach((group) => {
    const groupDiv = document.createElement("div");
    groupDiv.className = "mb-4";

    let activitiesHtml = '<ul class="list-unstyled ms-1">';
    group.activities.forEach((activity) => {
      const formattedActivity = activity.replace(/"([^"]+)"/g, "«$1»");
      activitiesHtml += `<li class="mb-2 small">• ${formattedActivity}</li>`;
    });
    activitiesHtml += "</ul>";

    groupDiv.innerHTML = `
            <h5 class="fw-bold mb-3 text-secondary border-bottom pb-1" style="width: fit-content;">${group.year}:</h5>
            ${activitiesHtml}
        `;
    extraContainer.appendChild(groupDiv);
  });
}
