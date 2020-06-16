import {useParams, withRouter} from "react-router";
import {connect} from "react-redux";
import React, {useEffect} from "react";
import {Alert, Button, Form} from "react-bootstrap";
import {initDAppUpdateOffer, UpdateDAppOfferModel} from "./types/UpdateDAppOfferModel";
import {UpdateDAppOffer} from "./functions/update-dappoffer";
import {GetDAppOffer} from "./functions/get-dappoffer";
import {DAppResponses} from './types/DAppResponses';


const DAppUpdate = (props: any)=>{
    const {id} = useParams();
    let updateModel = initDAppUpdateOffer;

    const UpdateDApp = async (event: any) => {
        event.preventDefault();
        event.stopPropagation();
        try {
            console.log(updateModel);
            await UpdateDAppOffer(id, updateModel,props.auth.User.token);
            props.history.push("/dapp-overview")
        } catch (er) {
            addError(er);
        }
    };

    const [editHtmlBlock, setEditHtmlBlock] = React.useState(<div/>)
    const [error, setError] = React.useState(<div/>);
    const addError = async (er: any) => {
        setError(<Alert variant={"warning"} onClick={
            () => {
                setError(<div/>);
            }}>{er.message}</Alert>);
    };

    useEffect(() => {
        const initializeHtmlBlock = async (model: UpdateDAppOfferModel) => {
            setEditHtmlBlock(
                <Form className={"form-container"}>
                    <Form.Group controlId="Title">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" defaultValue={model.Title} placeholder="Title" onChange={
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
                    <Form.Group controlId="DelegatesNeededForOffer">
                        <Form.Label>Amount of Delegates needed</Form.Label>
                        <Form.Control type="number" min="0" defaultValue={model.DelegatesNeededForOffer}
                                      placeholder="please enter a number..." onChange={
                            (event: any) => {
                                if(parseInt(event.target.value) < 0){
                                    event.target.value =0;
                                }
                                updateModel.DelegatesNeededForOffer = parseInt(event.target.value)
                            }
                        }/>
                    </Form.Group>
                    <Form.Group controlId="Lenght of Offer">
                        <Form.Label>How long the contract will last in months</Form.Label>
                        <Form.Control type="number" min="0" defaultValue={model.OfferLengthInMonths}
                                      placeholder="please enter a number..." onChange={
                            (event: any) => {
                                if(parseInt(event.target.value) < 0){
                                    event.target.value =0;
                                }
                                updateModel.OfferLengthInMonths = parseInt(event.target.value)
                            }
                        }/>
                    </Form.Group>
                    <Form.Group controlId="Lisk per month">
                        <Form.Label>Lisk per month</Form.Label>
                        <Form.Control type="number" min="0" defaultValue={model.LiskPerMonth}
                                      placeholder="please enter a number..." onChange={
                            (event: any) => {
                                if(parseInt(event.target.value) < 0){
                                    event.target.value =0;
                                }
                                updateModel.LiskPerMonth = parseInt(event.target.value)
                            }
                        }/>
                    </Form.Group>
                    <Form.Group controlId="Region">
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
                    <Form.Group controlId="DateStart">
                        <Form.Label>Date start</Form.Label>
                        <Form.Control type="Date" defaultValue={model.DateStart}
                                      placeholder="Date the contract will start" onChange={
                            (event: any) => {
                                updateModel.DateStart = event.target.value
                            }
                        }/>
                    </Form.Group>
                    <Form.Group controlId="DateStart">
                        <Form.Label>Date End</Form.Label>
                        <Form.Control type="Date" defaultValue={model.DateEnd} placeholder="Date the contract will End"
                                      onChange={
                                          (event: any) => {
                                              updateModel.DateEnd = event.target.value
                                          }
                                      }/>
                    </Form.Group>
                    <Button type={"submit"} variant="primary" onClick={UpdateDApp}>
                        Create DApp Offer
                    </Button>
                </Form>
            );
        };
        const init = async () => {
            try {

                let result: DAppResponses = await GetDAppOffer(id);
                let updatemodel: UpdateDAppOfferModel = {
                    Title: result.title,
                    LiskPerMonth: result.liskPerMonth,
                    Provider: {id: result.provider.id, Email: result.provider.name},
                    DelegatesNeededForOffer : result.delegatesNeededForOffer,
                    OfferLengthInMonths : result.offerLengthInMonths,
                    Region: result.region,
                    Description: result.description,
                    DateEnd : result.dateEnd,
                    DateStart : result.dateStart
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







    return(<div>
        {error}
        {editHtmlBlock}
    </div>);
};

const mapStateToProps = (state: any) => {
    return {
        auth: state.auth
    };
};


export default withRouter(connect(mapStateToProps)(DAppUpdate));