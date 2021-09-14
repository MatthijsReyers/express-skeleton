import { Http422Error } from "./api/api.errors";

/**
 * Reusable decorator factory, takes in a check function that is responsible 
 * for throwing any needed errors and enforcing the constraints provided by 
 * the decorator.
 * 
 * @param {Function} check: Checking 
 * @returns {Function} decorator
 */
function decoratorFactory(check:(val:any, key:string) => void)
{
    return (target: object, propertyKey: string|symbol) => {
        // Value variable, this will actually store the variable if the old 
        // variable need to be overwritten with a getter/setter obj.
        let value: number|null;

        // Check if the target property was already assigned a getter and a 
        // setter, in which case we do not want to overwrite the old setter.
        let descriptor = Object.getOwnPropertyDescriptor(target, propertyKey);
        if (descriptor !== undefined && !!descriptor['set']) {

            let oldGetter = descriptor.get!;
            let oldSetter = descriptor.set!;

            Reflect.defineProperty(
                target,
                propertyKey,
                {
                    configurable: true,
                    enumerable: true,
                    get: () => oldGetter(),
                    set: (newValue: number) => {
                        check(newValue, String(propertyKey));
                        oldSetter(newValue);
                    }
                }
            );
        }

        // Target is just a pure variable, overwrite it with a getter and 
        // a setter obj.
        else Reflect.defineProperty(
            target,
            propertyKey,
            {
                configurable: true,
                enumerable: true,
                get: () => value,
                set: (newValue: number) => {
                    check(newValue, String(propertyKey));
                    value = newValue;
                }
            }
        );
    }
}

/**
 * This decorator makes sure that a given property is an integer within 
 * the given range.
 * Note that while this decorator prevents the property from being set to 
 * `undefined`, it does not prevent the value from being set to null that can 
 * be achieved by chaining it with the `NotNull` decorator.
 * 
 * @param {number} min: Minimum value the property may take on.
 * @param {number} max: Maximum value the property may take on.
 * @throws {Http422Error} If a value is supplied that is `undefined` or not 
 *         within the allowed range of values for the property.
 */
export function Range(min:number, max:number)
{
    // Check function, actually enforces the constraints of this decorator.
    function checkRange(newValue: number|null, propertyKey: string)
    {
        // This decorator allows null values.
        if (newValue === null) return;

        if (newValue === undefined)
            throw new Http422Error(`Request is missing value for property '${propertyKey}'.`);
        if (isNaN(newValue))
            throw new Http422Error(`Value '${newValue}' for property '${propertyKey}' is not a number`);
        if (newValue > max) 
            throw new Http422Error(`Value '${newValue}' is too big for '${propertyKey}' please use a value between ${min}-${max}.`);
        if (newValue < min)
            throw new Http422Error(`Value '${newValue}' is too small for '${propertyKey}' please use a value between ${min}-${max}.`);
    }

    return decoratorFactory(checkRange);
}

/**
 * This decorator makes sure that a given property is never set to null.
 * 
 * @throws {Http422Error} If a value is supplied that is `undefined` or null.
 */
export function NotNull()
{
    // Check function, actually enforces the constraints of this decorator.
    function checkNotNull(newValue: number|null, propertyKey: string)
    {
        if (newValue === undefined)
            throw new Http422Error(`Request is missing value for property '${propertyKey}'.`);
        if (newValue === null) 
            throw new Http422Error(`Property '${propertyKey}' cannot be null.`);
    }

    return decoratorFactory(checkNotNull);
}

export function Unsigned()
{
    // Check function, actually enforces the constraints of this decorator.
    function checkUnsigned(newValue: number|null, propertyKey: string)
    {
        // This decorator does not filter out null values.
        if (newValue === null) return;

        if (newValue < 0)
            throw new Http422Error(`Property '${propertyKey}' cannot be negative.`);
    }

    return decoratorFactory(checkUnsigned);
}

export function Length(length:number)
{
        // Check function, actually enforces the constraints of this decorator.
        function checkLength(newValue: string|any[], propertyKey: string)
        {
            // This decorator does not filter out null values.
            if (newValue === null) return;
    
            if (newValue.length > length)
                throw new Http422Error(`Property '${propertyKey}' cannot be longer than '${length}'.`);
        }
    
        return decoratorFactory(checkLength)
}