import {useParams, withRouter} from "react-router";
import {connect} from "react-redux";
import React, {useEffect} from "react";
import {Alert} from "react-bootstrap";
import {CreateDelegateOfferModel, initDelegateCreateOffer} from "./types/CreateDelegateOfferModel";
import {createDelegateOffer} from "./functions/create-delegateoffer";

const DelegateUpdate = (props : any) =>{
    const {id} = useParams();
    const createModel : CreateDelegateOfferModel = initDelegateCreateOffer;
    const UpdateDelegate = async (event: any)=>{
        event.preventDefault();
        event.stopPropagation();
        try{
            var obj = await updateDelegateOffer(createModel);
            props.history.push("/dapp-overview")
        }
        catch(er){
            addError(er);
        }
    };
    useEffect(() => {
        const getDelegateInformation = async ()=>{

        }
    },[]);//onmount fill in provider
    //error warning
    const [error, setError] = React.useState(<div/>);
    const addError = async (er: any) =>{
        setError(<Alert variant={"warning"} onClick={
            () => {
                setError(<div/>);
            }}>{er.message}</Alert>);
    };

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


export default withRouter(connect(mapStateToProps)(DelegateUpdate));