
/**
 * Class for mapping the throwing of the 403 error
 */
export class ForbiddenException extends Error{
    constructor(message : string){
        super(message);
    }
}