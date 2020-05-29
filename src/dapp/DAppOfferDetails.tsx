import React, {useEffect} from "react";
import {DAppOffer, User} from './types/DAppOffer';
import config from "../config.json";
import {useParams, withRouter} from "react-router";
import {Alert, Col, Form, ListGroup, Row} from "react-bootstrap";
import {string} from "prop-types";
import {Link} from "react-router-dom";
import {connect} from "react-redux";

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
            console.log(id);
            let idRequest: string = "/"+id;
            let response: Response = await fetch(config.SERVICES.DAppOfferGet+idRequest, options);
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
                const participants = details.delegatesCurrentlyInOffer.map(
                    (delegate: User) =>
                        <ListGroup.Item>
                            <Link to={"/profile/" + delegate.id}>
                                {delegate.name}
                            </Link>
                        </ListGroup.Item>
                );
                let participantBlock = <ListGroup>{participants}</ListGroup>;


                setInformation(
                    <Form>
                        <h3><Form.Group>
                            <Form.Label>Offer made
                                by: <Link to={"/profile/" + details.provider.id}><strong>{details.provider.name}</strong></Link>.</Form.Label>
                        </Form.Group>
                        </h3>
                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control readOnly={true} as="textarea" rows="3" value={details.description}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>You will need to be available is
                                for <strong>{details.offerLengthInMonths}</strong> months.</Form.Label>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Reward will be <strong>{details.liskPerMonth}</strong> Lisk a month.</Form.Label>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Delegates need in this offer: <strong>{details.delegatesNeededForOffer}</strong>.</Form.Label>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>delegates currently in offer:</Form.Label>
                            <Form>
                            {participantBlock}
                            </Form>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Date start: <strong>{details.dateStart}</strong></Form.Label>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Date end : <strong>{details.dateEnd}</strong> </Form.Label>
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