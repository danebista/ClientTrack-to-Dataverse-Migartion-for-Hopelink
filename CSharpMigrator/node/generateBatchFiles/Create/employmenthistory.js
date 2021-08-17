import { getSqlConnection } from '../../sqlConnection';

module.exports = {
    getRecordSet: async function(skip, take){
        let pool = await getSqlConnection();
    

        const { recordset } = await pool.request()
        .query(`select *
                FROM hl_WorkHistory_temp
                ORDER BY ID
                OFFSET     ${skip} ROWS 
                FETCH NEXT ${take} ROWS ONLY`);

        const batchKey = recordset.length > 0 ? `${recordset[0].WorkHistID}_${recordset[recordset.length-1].WorkHistID}` : null;


        return { recordset, batchKey  };
    },
    operationSchema: {
        entity: "hl_employmenthistories",
        operation: "POST",
        fields:{
            "hl_annualwage": "AnnualWage",
            "hl_averageweeklyhours": (record) => Math.trunc(record["AvgWeeklyHours"]),
            "hl_classification": "Classification",
            "hl_datestarted": "DateStarted",
            "hl_datehired": "DateHired",
            "hl_dateended": "DateEnded",
            "hl_employer": "Employer",
            "hl_employmentlastverified": "LastVerified",
            "hl_hourlywage": "HourlyWage",
            "hl_jobposition": "JobPosition",
            "hl_monthlywage": "MonthlyWage",
            "hl_benefits": (record) => record["BenefitOptions"]?true: false,

            "hl_benefitlist": "BenefitOptions",
            "hl_reasonleft": "ReasonLeft",
            "hl_terminationtype": "TerminationType",
            "hl_client_id@odata.bind": {
                relatedEntity: "contacts",
                field: "ClientGuid"
            },
            "hl_benefits": false,
            "hl_migrationid": (record)=> record['WorkHistID'].toString()
        }
    },
    stageData: async function(){
        let pool = await getSqlConnection();
        await pool.request().execute("[dbo].[hl_stage_WorkHistory]");
    },
    confirmData: async function(){
        let pool = await getSqlConnection();
        await pool.request().execute("[dbo].[hl_confirm_WorkHistory_atag]");
    }    
}