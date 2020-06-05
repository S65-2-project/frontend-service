import React, {useEffect} from "react";
import {DAppOffer} from './types/DAppOffer';
import config from "../config.json";
import {useParams, withRouter} from "react-router";
import {Alert, Form, ListGroup} from "react-bootstrap";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {User} from "./types/CreateDAppOfferModel";

export const DAppOfferDetails = (props: any) => {

    const {id} = useParams();

    const [information, setInformation] = React.useState(<div/>)
    const [error, setError] = React.useState(<div/>)


    useEffect(() => {
        const getInformation = async (id: string): Promise<DAppOffer> => {
            let options: RequestInit = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin" : "http:localhost:3000"
                },
                mode: "cors",
                cache: "default"
            };
            let idRequest: string = "/"+id;
            let response: Response = await fetch(config.SERVICES.DAPP+idRequest, options);
            let body = await response.text();
            if (response.status === 200) {
                console.log(body)
                return JSON.parse(body); //returns type DAppOffer if backend is consistent.
            } else {
                throw new Error(body);
            }
        };

        const loadHtml = async (id: string) => {
            try {

                let details: DAppOffer = await getInformation(id);
                const participants = details.DelegatesCurrentlyInOffer.map(
                    (delegate: User) =>
                        <ListGroup.Item>
                            <Link to={"/profile/" + delegate.Id}>
                                {delegate.Name}
                            </Link>
                        </ListGroup.Item>
                );
                let participantBlock = <ListGroup>{participants}</ListGroup>;


                setInformation(
                    <Form>
                        <h3><Form.Group>
                            <Form.Label>Offer made
                                by: <Link to={"/profile/" + details.Provider.Id}><strong>{details.Provider.Name}</strong></Link>.</Form.Label>
                        </Form.Group>
                        </h3>
                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control readOnly={true} as="textarea" rows="3" value={details.Description}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>You will need to be available is
                                for <strong>{details.OfferLengthInMonths}</strong> months.</Form.Label>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Reward will be <strong>{details.LiskPerMonth}</strong> Lisk a month.</Form.Label>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Delegates need in this offer: <strong>{details.DelegatesNeededForOffer}</strong>.</Form.Label>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>delegates currently in offer:</Form.Label>
                            <Form>
                            {participantBlock}
                            </Form>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Date start: <strong>{details.DateStart}</strong></Form.Label>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Date end : <strong>{details.DateEnd}</strong> </Form.Label>
                        </Form.Group>
                    </Form>
                )
            } catch (e) {
                setError(<Alert variant={"warning"} onClick={() => setError(<div/>)}>{e.message}</Alert>)
            }


        };
        if (id) {
            loadHtml(id)
        }


    }, [id]);

    return (
        <div>
            {error}
            {information}
        </div>
    )
};

const mapStateToProps = (state: any) => {
    return {
        auth: state.auth
    };
};

export default withRouter(connect(mapStateToProps)(DAppOfferDetails));