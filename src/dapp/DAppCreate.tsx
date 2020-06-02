import React, {useEffect} from 'react';
import {withRouter} from "react-router";
import {connect} from "react-redux";
import {Button, Form} from "react-bootstrap";
import {CreateDAppOfferModel, initDAppCreateOffer} from "./types/CreateDAppOfferModel";
import {Alert} from 'react-bootstrap';
import {createDappOffer} from "./functions/create-dappoffer";

const DAppCreate = (props: any) => {
    const createModel : CreateDAppOfferModel = initDAppCreateOffer;
    const CreateDApp = async (event : any) => {
        event.preventDefault();
        event.stopPropagation();
        try{
            var obj = await createDappOffer(createModel);
           props.history.push("/dappoffer/"+obj.Id);
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
    //eslint
    useEffect(() => {createModel.Provider = {Id : props.auth.User.id, Name :props.auth.User.email}});//onmount fill in provider

    const createHtmlBlock =
        <Form className={"form-container"} onSubmit={CreateDApp}>
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
            <Form.Group controlId="DelegatesNeededForOffer">
                <Form.Label>Amount of Delegates needed</Form.Label>
                <Form.Control type="number" placeholder="please enter a number..." onChange={
                    (event: any) => {
                        createModel.DelegatesNeededForOffer = parseInt(event.target.value)
                    }
                }/>
            </Form.Group>
            <Form.Group controlId="Lenght of Offer">
                <Form.Label>How long the contract will last in months</Form.Label>
                <Form.Control type="number" placeholder="please enter a number..." onChange={
                    (event: any) => {
                        createModel.OfferLengthInMonths = parseInt(event.target.value)
                    }
                }/>
            </Form.Group>
            <Form.Group controlId="Lisk per month">
                <Form.Label>Lisk per month</Form.Label>
                <Form.Control type="number" placeholder="please enter a number..." onChange={
                    (event: any) => {
                        createModel.LiskPerMonth = parseInt(event.target.value)
                    }
                }/>
            </Form.Group>
            <Form.Group controlId="Region">
                <Form.Label>Region</Form.Label>
                <Form.Control type="text" placeholder="Region" onChange={
                    (event: any) => {
                        createModel.Region = event.target.value
                    }
                }/>
            </Form.Group>
            <Form.Group controlId="DateStart">
                <Form.Label>Date start</Form.Label>
                <Form.Control type="Date" placeholder="Date the contract will start" onChange={
                    (event: any) => {
                        createModel.DateStart= event.target.value
                    }
                }/>
            </Form.Group>
            <Form.Group controlId="DateStart">
                <Form.Label>Date End</Form.Label>
                <Form.Control type="Date" placeholder="Date the contract will End" onChange={
                    (event: any) => {
                        createModel.DateEnd = event.target.value
                    }
                }/>
            </Form.Group>
            <Button type={"submit"} variant="primary" onClick={CreateDApp}>
                Create DApp Offer
            </Button>
        </Form>;

    return (
        <div>
            {error}
            {createHtmlBlock}
        </div>
    )
};

const mapStateToProps = (state: any) => {
    return {
        auth: state.auth
    };
};


export default withRouter(connect(mapStateToProps)(DAppCreate));