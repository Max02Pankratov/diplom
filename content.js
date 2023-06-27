// Функция, которая будет вызвана при нажатии кнопки
function saveMhtml() {
    // Создаем новый XMLHttpRequest
    const xhr = new XMLHttpRequest();

    // Устанавливаем тип ответа как "document"
    xhr.responseType = 'document';

    // Отправляем GET-запрос на текущую страницу
    xhr.open('GET', window.location.href, true);

    xhr.onload = function () {
        if (xhr.status === 200) {
            const boundary = '----=_NextPart_001_0000_01D47BC4.C7E2C0D0';
            const html = xhr.response.documentElement.outerHTML;
            const dataUri = 'data:text/html;charset=utf-8,' + encodeURIComponent(html);

            const mhtml = [
                'MIME-Version: 1.0',
                'Content-Type: multipart/related; boundary="' + boundary + '";',
                '',
                '--' + boundary,
                'Content-Type: text/html; charset="utf-8"',
                'Content-Transfer-Encoding: 7bit',
                '',
                html,
                '',
                '--' + boundary + '--'
            ].join('\n');

            const blob = new Blob([mhtml], {type: 'multipart/related'});
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = 'index.mhtml';
            document.body.appendChild(link);
            link.click();

            // Освобождаем ссылку на Blob
            URL.revokeObjectURL(url);

            console.log('HTML-код сохранен в файле index.mhtml');
        } else {
            console.error('Не удалось загрузить HTML-код страницы');
        }
    };

    xhr.send();
}

// Создаем кнопку
const button = document.createElement('button');
button.textContent = 'Копировать HTML';
button.style.position = 'fixed';
button.style.top = "10px";
button.style.right = "10px";
button.style.backgroundColor = '#f5b342';
button.style.color = 'white';
button.style.padding = "8px";
button.style.borderRadius = "8px";
button.style.border = 'none'
button.style.color = 'red'
button.addEventListener('click', saveMhtml);
document.body.appendChild(button);


// myButton
const myButton = document.createElement("button");

myButton.innerHTML = "Отправить";
myButton.classList.add("btn");

const myDiv = document.createElement("div");
myDiv.classList.add("my_div");
myDiv.appendChild(myButton);

const serpItems = document.querySelectorAll(".serp-item");
serpItems.forEach(function (serpItem) {
    const clonedDiv = myDiv.cloneNode(true);
    clonedDiv.addEventListener('click', function () {
        const link = serpItem.querySelector('.serp-item__title').getAttribute('href');
        fetch(link)
            .then(response => response.text())
            .then(data => {

                const parser = new DOMParser();
                const html = parser.parseFromString(data, 'text/html');
                const element = html.querySelector('.resume-applicant');

                const resumePersonalGender = element.querySelector('span[data-qa="resume-personal-gender"]').textContent

                const resumePersonalBirthday = element.querySelector('span[data-qa="resume-personal-age"]').textContent.trim()

                const salaryElement = element.querySelector('span.resume-block__salary[data-qa="resume-block-salary"]');

                const specialization = element.querySelector('li.resume-block__specialization[data-qa="resume-block-position-specialization"]').textContent.trim();

                const employment = element.querySelector('.resume-block-container p:nth-child(1)').textContent.trim().replace(/\s+/g, ' ');

                const schedule = element.querySelector('.resume-block-container p:nth-child(2)').textContent.trim().replace(/\s+/g, ' ');

                const experienceElement = element.querySelector('span.resume-block__title-text.resume-block__title-text_sub');

                const experienceText = experienceElement.textContent.trim().replace(/\s+/g, ' ');

                const skillsElement = element.querySelector('div.resume-block-container[data-qa="resume-block-skills-content"]');

                const skills = skillsElement.innerHTML.trim();

                console.log(element)
                console.log(resumePersonalGender, resumePersonalBirthday)
                console.log(salaryElement);
                console.log(specialization, employment, schedule);
                console.log(experienceText);
                console.log(skills);

                fetch('https://odoo.webant.ru/web/dataset/call_kw/hr.applicant/create', {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer 9a3c2f8c9926e190d85b8f2b88f98a91',
                        'Content-Type': 'application/json',
                        'Origin': 'https://*.hh.ru',
                    },
                    body: JSON.stringify({
                        jsonrpc: '2.0',
                        method: 'call',
                        id: 102,
                        params: {
                            model: 'hr.applicant',
                            method: 'create',
                            args: [{
                                "stage_id": 7,
                                "kanban_state": "normal",
                                "active": true,
                                "name": "test",
                                "partner_name": "test1",
                                "partner_id": false,
                                "refuse_reason_id": false,
                                "email_from": "test@test.com",
                                "email_cc": false,
                                "partner_phone": "89999999999",
                                "partner_mobile": "89999999999",
                                "type_id": 2,
                                "categ_ids": [
                                    [
                                        6,
                                        false,
                                        []
                                    ]
                                ],
                                "user_id": 12,
                                "date_closed": false,
                                "priority": "0",
                                "medium_id": false,
                                "source_id": 10,
                                "job_id": 4,
                                "department_id": 9,
                                "company_id": 1,
                                "salary_expected": 5000,
                                "salary_expected_extra": false,
                                "salary_proposed": 1,
                                "salary_proposed_extra": false,
                                "availability": false,
                                "emp_id": false,
                                "description": "<p><br></p>",
                                "message_follower_ids": [],
                                "activity_ids": [],
                                "message_ids": []
                            }],
                            kwargs: {
                                context: {
                                    lang: 'ru_RU',
                                    tz: 'Europe/Moscow',
                                    uid: 12,
                                    allowed_company_ids: [1],
                                    params: {
                                        cids: 1,
                                        menu_id: 254,
                                        action: 358,
                                        active_id: 4,
                                        model: 'hr.applicant',
                                        view_type: 'kanban'
                                    },
                                    active_id: 4,
                                    active_ids: [4],
                                    search_default_job_id: [4],
                                    default_job_id: 4
                                }
                            }
                        }
                    })
                })
                    .then(response => response.json())
                    .then(data => console.log(data))
                    .catch(error => console.error(error))
            })
    });

    serpItem.appendChild(clonedDiv);
});