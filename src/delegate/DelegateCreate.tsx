import {withRouter} from "react-router";
import {connect} from "react-redux";
import React, {useEffect} from "react";
import {Alert} from "react-bootstrap";
import {CreateDelegateOfferModel, initDelegateCreateOffer} from "./types/CreateDelegateOfferModel";

const DelegateCreate = (props: any) =>{
    //createmodel var initiates with standard values
    const createModel : CreateDelegateOfferModel = initDelegateCreateOffer;
    useEffect(() => {createModel.Provider = {Id : props.auth.User.id, Name :props.auth.User.email}});//onmount fill in provider
    const CreateDelegate = async (event: any)=>{
        
    }
    const [error, setError] = React.useState(<div/>);
    const addError = async (er: any) =>{
        var newerror = <Alert variant={"warning"} onClick={
            () => {
                setError(<div/>);
            }}>{er.message}</Alert>;
    };


    const [editDelegateHtmlBlock, setEditDelegateHtmlBlock] = React.useState(<div/>);
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