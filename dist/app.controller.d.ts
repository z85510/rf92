export declare class AppController {
    getHealth(): {
        status: string;
        timestamp: string;
        service: string;
    };
    getRoot(): {
        message: string;
        documentation: string;
        health: string;
    };
}
