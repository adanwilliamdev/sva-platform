import requests

login = requests.post('http://localhost:8000/auth/login', data={
    'username': 'recrutador',
    'password': '123456'
})

if login.status_code == 200:
    token = login.json()['access_token']
    headers = {'Authorization': f'Bearer {token}'}
    
    # Buscar vagas
    jobs = requests.get('http://localhost:8000/jobs/recruiter', headers=headers)
    print('Vagas encontradas:')
    for job in jobs.json():
        print(f'  ID: {job["id"]} - {job["title"]}')
        
        # Buscar candidaturas
        apps = requests.get(f'http://localhost:8000/applications/job/{job["id"]}', headers=headers)
        print(f'    Candidaturas: {len(apps.json())}')
        for app in apps.json():
            print(f'      - Candidato: {app.get("candidate_name", "N/A")} | Score: {app.get("compatibility_score")} | Status: {app.get("status")}')
else:
    print(f'Falha no login: {login.status_code}')
    print(login.text)
