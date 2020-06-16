import {useParams, withRouter} from "react-router";
import {connect} from "react-redux";
import React, {useEffect} from "react";
import {Alert, Button, Form} from "react-bootstrap";
import {GetDelegateoffer} from "./functions/get-delegateoffer";
import {initDelegateUpdateOffer, UpdateDelegateOfferModel} from "./types/UpdateDelegateOfferModel";
import {UpdateDelegateOffer} from "./functions/update-delegateoffer";
import {DappoferResponse} from "./types/dappoferResponse";

const DelegateUpdate = (props: any) => {
    const {id} = useParams();
    let updateModel = initDelegateUpdateOffer;
    const [editHtmlBlock, setEditHtmlBlock] = React.useState(<div/>)
    const UpdateDelegate = async (event: any) => {
        event.preventDefault();
        event.stopPropagation();
        try {
            await UpdateDelegateOffer(id, updateModel, props.auth.User.token);
            props.history.push("/dapp-overview")
        } catch (er) {
            addError(er);
        }
    };
    useEffect(() => {
        const initializeHtmlBlock = async (model: UpdateDelegateOfferModel) => {
            setEditHtmlBlock(
                <Form>
                    <Form.Group controlId="Title">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" placeholder="Title" defaultValue={model.Title} onChange={
                            (event: any) => {
                                updateModel.Title = event.target.value
                            }
                        }/>
                    </Form.Group>
                    <Form.Group controlId="Description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as={"textarea"} type={"textarea"} defaultValue={model.Description}
                                      placeholder="please enter a description..." onChange={
                            (event: any) => {
                                updateModel.Description = event.target.value
                            }
                        }/>
                    </Form.Group>
                    <Form.Group controlId="Lenght of Offer">
                        <Form.Label>How many months are you able to deliver your services</Form.Label>
                        <Form.Control type="number" min="0" defaultValue={model.AvailableForInMonths}
                                      placeholder="please enter a number..." onChange={
                            (event: any) => {
                                if(parseInt(event.target.value) < 0){
                                    event.target.value =0;
                                }
                                updateModel.AvailableForInMonths = parseInt(event.target.value)
                            }
                        }/>
                    </Form.Group>
                    <Form.Group controlId="Lenght of Offer">
                        <Form.Label>How much do you wish to be paid a month</Form.Label>
                        <Form.Control type="number"  min="0" defaultValue={model.LiskPerMonth}
                                      placeholder="please enter a number..." onChange={
                            (event: any) => {
                                if(parseInt(event.target.value) < 0){
                                    event.target.value =0;
                                }
                                updateModel.LiskPerMonth = parseInt(event.target.value)
                            }
                        }/>
                    </Form.Group>
                    <Form.Group controlId="Title">
                        <Form.Label>Region</Form.Label>
                        <Form.Control as="select" onChange={
                            (event: any) => {
                                updateModel.Region = event.target.value
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
                    <Button type={"submit"} variant="primary" onClick={UpdateDelegate}>
                        Create Delegate Offer
                    </Button>
                </Form>
            );
        };
        const init = async () => {
            try {

                let result: DappoferResponse = await GetDelegateoffer(id);
                let updatemodel: UpdateDelegateOfferModel = {
                    Title: result.title,
                    LiskPerMonth: result.liskPerMonth,
                    Provider: {Id: result.provider.id, Email: result.provider.name},
                    AvailableForInMonths: result.availableForInMonths,
                    Region: result.region,
                    Description: result.description
                };
                // eslint-disable-next-line
                updateModel = updatemodel;
                initializeHtmlBlock(updatemodel);
            } catch (Error) {
                addError(Error)
            }
        };
        init();
    }, []);


    //error warning
    const [error, setError] = React.useState(<div/>);
    const addError = async (er: any) => {
        setError(<Alert variant={"warning"} onClick={
            () => {
                setError(<div/>);
            }}>{er.message}</Alert>);
    };

    return (
        <div>
            {error}
            {editHtmlBlock}
        </div>
    )
};

const mapStateToProps = (state: any) => {
    return {
        auth: state.auth
    };
};


export default withRouter(connect(mapStateToProps)(DelegateUpdate));