import {withRouter} from "react-router";
import {connect} from "react-redux";
import {Alert,Button, Form} from "react-bootstrap";
import React, {useEffect} from "react";
import {CreateDelegateOfferModel, initDelegateCreateOffer} from "./types/CreateDelegateOfferModel";
import {createDelegateOffer} from "./functions/create-delegateoffer";

const DelegateCreate = (props: any) =>{
    //createmodel var initiates with standard values
    const createModel : CreateDelegateOfferModel = initDelegateCreateOffer;
    useEffect(() => {
        createModel.Provider = {Id : props.auth.User.id, Email :props.auth.User.email}});//onmount fill in provider
    const CreateDelegate = async (event: any)=>{
        event.preventDefault();
        event.stopPropagation();
        try{
            await createDelegateOffer(createModel, props.auth.User.token);
            props.history.push("/delegate-overview")
        }
        catch(er){
            addError(er);
        }
    };

    const [error, setError] = React.useState(<div/>);
    const addError = async (er: any) =>{
        setError(<Alert variant={"warning"} onClick={
            () => {
                setError(<div/>);
            }}>{er.message}</Alert>);
    };


    const editDelegateHtmlBlock =
        <Form>
            <Form.Group controlId="Title">
                <Form.Label>Title</Form.Label>
                <Form.Control type="text" placeholder="Title" onChange={
                    (event: any) => {
                        createModel.Title = event.target.value
                    }
                }/>
            </Form.Group>
            <Form.Group controlId="Description">
                <Form.Label>Description</Form.Label>
                <Form.Control as={"textarea"} type={"textarea"} placeholder="please enter a description..." onChange={
                    (event: any) => {
                        createModel.Description = event.target.value
                    }
                }/>
            </Form.Group>
            <Form.Group controlId="Lenght of Offer">
                <Form.Label>How many months are you able to deliver your services</Form.Label>
                <Form.Control type="number" min="0" placeholder="please enter a number..." onChange={
                    (event: any) => {
                        if(parseInt(event.target.value) < 0){
                            event.target.value =0;
                        }
                        createModel.AvailableForInMonths = parseInt(event.target.value)
                    }
                }/>
            </Form.Group>
            <Form.Group controlId="Lenght of Offer">
                <Form.Label>How much do you wish to be paid a month</Form.Label>
                <Form.Control type="number" min="0" placeholder="please enter a number..." onChange={
                    (event: any) => {
                        if(parseInt(event.target.value) < 0){
                            event.target.value =0;
                        }
                        createModel.LiskPerMonth = parseInt(event.target.value)
                    }
                }/>
            </Form.Group>
            <Form.Group controlId="Title">
                <Form.Label>Region</Form.Label>
                <Form.Control as="select" onChange={
                    (event: any) => {
                        createModel.Region = event.target.value
                    }}>
                    <option>...</option>
                    <option>Europe</option>
                    <option>Asia</option>
                    <option>Africa</option>
                    <option>Oceania</option>
                    <option>North-America</option>
                    <option>South-America</option>
                </Form.Control>
            </Form.Group>
            <Button type={"submit"} variant="primary" onClick={CreateDelegate}>
                Create Delegate Offer
            </Button>
        </Form>;

    return (
        <div>
            {error}
            {editDelegateHtmlBlock}
        </div>
    )
};

const mapStateToProps = (state: any) => {
    return {
        auth: state.auth
    };
};


export default withRouter(connect(mapStateToProps)(DelegateCreate));