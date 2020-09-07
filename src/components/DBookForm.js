import React, { useState, useEffect } from "react";
import { Grid, TextField, withStyles, FormControl, InputLabel, Select, MenuItem, Button, FormHelperText } from "@material-ui/core";
import useForm from "./useForm";
import { connect } from "react-redux";
import * as actions from "../actions/dBook";
import { useToasts } from "react-toast-notifications";

const styles = theme => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            minWidth: 230,
        }
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 230,
    },
    smMargin: {
        margin: theme.spacing(1)
    }
})

const initialFieldValues = {
    fullName: '',
    mobile: '',
    email: '',
    age: '',
    bloodGroup: '',
    address: ''
}

const DBookForm = ({ classes, ...props }) => {

    //toast msg.
    const { addToast } = useToasts()

    //validate()
    //validate({fullName:'jenny'})
    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('title' in fieldValues)
            temp.title = fieldValues.title ? "" : "This field is required."
        if ('description' in fieldValues)
            temp.description = fieldValues.description ? "" : "This field is required."
        if ('author' in fieldValues)
            temp.author = fieldValues.author ? "" : "This field is required."
        if ('interpreter' in fieldValues)
            temp.interpreter = fieldValues.interpreter ? "" : "This field is required."
        if ('language' in fieldValues)
            temp.language = fieldValues.language ? "" : "This field is required."
        setErrors({
            ...temp
        })

        if (fieldValues == values)
            return Object.values(temp).every(x => x == "")
    }

    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm
    } = useForm(initialFieldValues, validate, props.setCurrentId)

    //material-ui select
    const inputLabel = React.useRef(null);
    const [labelWidth, setLabelWidth] = React.useState(0);

    const handleSubmit = e => {
        e.preventDefault()
        if (validate()) {
            const onSuccess = () => {
                resetForm()
                addToast("Submitted successfully", { appearance: 'success' })
            }
            if (props.currentId == 0)
                props.createDBook(values, onSuccess)
            else
                props.updateDBook(props.currentId, values, onSuccess)
        }
    }

    useEffect(() => {
        if (props.currentId != 0) {
            setValues({
                ...props.dBookList.find(x => x.id == props.currentId)
            })
            setErrors({})
        }
    }, [props.currentId])

    return (
        <form autoComplete="off" noValidate className={classes.root} onSubmit={handleSubmit}>
            <Grid container>
                <Grid item xs={6}>
                    <TextField
                        name="title"
                        variant="outlined"
                        label="Title"
                        value={values.title}
                        onChange={handleInputChange}
                        {...(errors.title && { error: true, helperText: errors.title })}
                    />
                    <TextField
                        name="description"
                        variant="outlined"
                        label="Description"
                        value={values.description}
                        onChange={handleInputChange}
                        {...(errors.description && { error: true, helperText: errors.description })}
                    />
                    <TextField
                        name="author"
                        variant="outlined"
                        label="Author"
                        value={values.author}
                        onChange={handleInputChange}
                        {...(errors.author && { error: true, helperText: errors.author })}
                    />
                </Grid>
                <Grid item xs={6}>

                    <TextField
                        name="interpreter"
                        variant="outlined"
                        label="Interpreter"
                        value={values.interpreter}
                        onChange={handleInputChange}
                        {...(errors.interpreter && { error: true, helperText: errors.interpreter })}
                    />
                    <TextField
                        name="price"
                        variant="outlined"
                        label="Price"
                        value={values.price}
                        onChange={handleInputChange}
                    />
                    <TextField
                        name="language"
                        variant="outlined"
                        label="Language"
                        value={values.language}
                        onChange={handleInputChange}
                    />
                    <div>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            className={classes.smMargin}
                        >
                            Submit
                        </Button>
                        <Button
                            variant="contained"
                            className={classes.smMargin}
                            onClick={resetForm}
                        >
                            Reset
                        </Button>
                    </div>
                </Grid> 
            </Grid>
        </form>
    );
}


const mapStateToProps = state => ({
    dBookList: state.dBook.list
})

const mapActionToProps = {
    createDBook: actions.create,
    updateDBook: actions.update
}

export default connect(mapStateToProps, mapActionToProps)(withStyles(styles)(DBookForm));