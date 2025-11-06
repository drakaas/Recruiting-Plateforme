export const civilityOptions = [
  { value: '', label: 'Sélectionner' },
  { value: 'mr', label: 'Monsieur' },
  { value: 'mrs', label: 'Madame' },
  { value: 'other', label: 'Non précisé' },
]

export const initialProfileState = {
  civility: '',
  firstName: '',
  lastName: '',
  city: '',
  postalCode: '',
  phone: '',
  github: '',
  linkedin: '',
  otherLinks: [{ name: '', url: '' }],
  projects: [{ name: '', level: '', organization: '', date: '', description: '', skills: '' }],
  documents: [{ name: '', file: null }],
}






