import { Application, Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { scheduleJob } from 'node-schedule';
import * as express from 'express';
import * as cors from 'cors';
import * as helmet from 'helmet';

import Routes  from './routes';
import workerCovidInfo from './services/workerCovidInfo';
import limiter from './middlewares/rateLimiter'

import ErrorHandler from './utils/errorHandler';

export default class App {
    private app: Application;
    private routes: Routes;

    constructor() {
        this.app = express();

	// Initialize middlewares
	this.initializeMiddlewares();

	// Define routes
	this.routes = new Routes;
	this.routes.defineRoutes();
	this.app.use(this.routes.routes);
    
	// Define error handler
        this.app.use(ErrorHandler);
    }

    private initializeMiddlewares(): void {
        this.app.use(express.json());
        this.app.use(cors());
        this.app.use(limiter);
        this.app.use(helmet());
    }

    private workers(): void {
        //second minute hour day-of-month month day-of-week
        scheduleJob('0 0 * * * *', workerCovidInfo);
    }
    
    public async start(args? : any): Promise<void> {
        /*
	 *  Initialize the express micro-service
	 */ 
        try {           
			const port = Number(process.env.PORT) || 3333;

            this.workers();
            
            // Para inserir a informação sobre o corona quando iniciar o sistema
            await workerCovidInfo();

            if (args)
		this.app.listen(port, args, () => console.log(`App running on port ${port}`));
            else 
                this.app.listen(port, () => console.log(`App running on port ${port}`));
            
            console.log('App is online!');
        } catch (err) {
            console.error(err.message);
            console.error('Unable to initiate the app!');
            process.exit(1);
        }
    }
}
