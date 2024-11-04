import path from 'node:path';
import { google } from 'googleapis';
import { config } from 'dotenv';
import { sumarUnaHora } from '../services/hours.js';
config({});

const keyFilePath = path.join(process.cwd(), 'calendarlaragazzariccia-267d7b2b2263.json');
const { CALENDAR_ID } = process.env
const auth = new google.auth.GoogleAuth({
  keyFile: keyFilePath,
  scopes: ['https://www.googleapis.com/auth/calendar'],
});

const calendar = google.calendar({ version: 'v3', auth });

export async function createEvent (date,hour,location,name, dateInit,dateFinal)  {
  try {
    const event = {
      summary: `Incontro salone con ${name}` ,
      location: `${location}`,
      description: 'peluquería',
      start: {
        dateTime: dateInit,
        timeZone: 'Europe/Rome',
      },
      end: {
        dateTime: dateFinal,
        timeZone: 'Europe/Rome',
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 10 },
        ],
      },
    };
    console.log(event);
    
    const crearEventoGoogle = await calendar.events.insert({
      calendarId:CALENDAR_ID,
      resource: event,
    });

    if(crearEventoGoogle){
      console.log(crearEventoGoogle);
    }
  } catch (error) {
    console.error('Error creating event:', error);
  }
};

export async function listEvents() {
    try {
      const res = await calendar.events.list({
        calendarId: CALENDAR_ID, 
        timeMin: (new Date()).toISOString(), 
        maxResults: 10, 
        singleEvents: true, 
        orderBy: 'startTime',
      });
  
      const events = res.data.items;
  
      if (events.length) {
        console.log('Próximos eventos:');
        events.map((event, i) => {
          const start = event.start.dateTime || event.start.date;
          console.log(`${start} - ${event.summary}`);
        });
      } else {
        console.log('No hay eventos próximos.');
      }
    } catch (error) {
      console.error('Error al listar los eventos:', error);
    }
}

export function calendarsGoogle (req,res){
    const calendar = google.calendar({version:'v3', auth:oauth2Client})
    calendar.calendarList.list({},(err,response)=>{
        try {
            const calendars = response.data.items
            res.json(calendars)
        } catch (error) {
            console.log('error');
            res.status(400).json({
                status: "error"
            })
        }
    })
}





