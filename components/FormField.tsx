import React from 'react'
import { FormItem, FormLabel, FormControl, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { Control, Controller, FieldValues, Path } from 'react-hook-form'

interface FormFieldProps<T extends FieldValues> {
    control: Control<T>,
    name: Path<T>,
    placeholder?: string,
    label: string,
    type?: 'text' | 'email' | 'password' | 'file'
}

const FormField = ({ control, name, placeholder, type = "text", label }: FormFieldProps<T>) => {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <FormItem>
                    <FormLabel className={label}>{label}</FormLabel>
                    <FormControl>
                        <Input type={type} className='input' placeholder={placeholder} {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )} />)
}


export default FormField