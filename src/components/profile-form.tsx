import { gql, useMutation, useQuery } from '@apollo/client';
import { useCallback, useEffect } from 'react';
import { UIButton, UIFormControl, UIInput, useForm } from 'ui-kit';

const __Query = gql`
    query form {
        profile: getProfile (id: 1 ) {
            stamp
            user_display_name
            user_email
            user_gender
            date_of_birth
        } 
    }
`;

const __Mutation = gql`
    mutation save($profile: ProfileInput) {
        saveProfile(profile: $profile) {
            status
        }
    }
`

export const ProfileForm: React.FC<{}> = () => {
    const { state, onChange, setFormValue } = useForm();
    
    const { data, refetch } = useQuery(__Query, { fetchPolicy: 'network-only', nextFetchPolicy: 'network-only' });
    const [saveProfile] = useMutation(__Mutation, { variables: { profile: state.profile } });

    const handleSubmit = useCallback(async (event) => {
        event.preventDefault();
        await saveProfile({ variables: { profile: state.value } });
        refetch({});
    }, [state]);

    useEffect(() => {
        if (data && data.profile) {
            setFormValue(data.profile);
        }
    }, [data]);

    return (
        <form onSubmit={handleSubmit}>
            <h1>My Profile <small>hash #{data?.profile?.stamp}</small></h1>
            <UIFormControl label='Name' name='user_display_name'>
                <UIInput type="text" value={state.value.user_display_name} onChange={onChange} />
            </UIFormControl>

            <UIFormControl label='Email' name='user_email'>
                <UIInput type="email" value={state.value.user_email} onChange={onChange} />
            </UIFormControl>

            <UIFormControl label='Gender' name='user_gender'>
                <UIInput type="text" value={state.value.user_gender} onChange={onChange} />
            </UIFormControl>

            <UIFormControl label='Date of Birth' name='date_of_birth'>
                <UIInput type="date" value={state.value.date_of_birth} onChange={onChange} />
            </UIFormControl>

            <UIButton label="Save" type="submit" />
        </form>
    );
};
