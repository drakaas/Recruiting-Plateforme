import { useEffect, useMemo, useState, useCallback } from 'react'
import { useApi } from '../../hooks/useApi'

export function useJobs() {
  const { request } = useApi()
  const [allJobs, setAllJobs] = useState([])
  const [companyInfo, setCompanyInfo] = useState(null)


  useEffect(() => {
    ;(async () => {
      try {
        const offers = await request('/offers')
        // Debug: log raw backend response and each entry's company field/state
        try {
          console.log('[jobs] /offers response (raw):', offers)
          if (Array.isArray(offers)) {
            offers.forEach((o, idx) => {
              const c = o?.company
              console.log(`[jobs] offer[${idx}] id=${o?._id || o?.id} company=`, c, 'type=', typeof c)
            })
          }
        } catch {}

        // Fetch and log enterprise (company) using recruiter id from offers
        try {
          const recruiterIds = Array.isArray(offers)
            ? Array.from(new Set(offers.map((o) => o?.recruiter).filter(Boolean)))
            : []
          if (recruiterIds.length > 0) {
            // fetch first recruiter's company (or iterate if needed)
            const recruiter = await request(`/recruiters/${recruiterIds[0]}`)
            const company = recruiter?.company || null
            setCompanyInfo(company)
            console.log('[jobs] recruiter(from offer):', recruiter)
            console.log('[jobs] recruiter.company (enterprise from offer):', company)
          }
        } catch (e) {
          try { console.error('[jobs] recruiter(from offer) fetch error:', e) } catch {}
        }
        const mapped = (Array.isArray(offers) ? offers : [])
          .filter((o) => (o.status || 'Disponible') === 'Disponible')
          .map((o) => ({
            id: o.id || o._id,
            title: o.title,
            company: (o && o.company && typeof o.company === 'object' && o.company.name) ? o.company.name : 'Entreprise',
            location: o.location || 'À préciser',
            contractType: o.contractType || 'À préciser',
            contractDuration: o.contractDuration || '',
            salary: o.salary || 'Non précisé',
            department: o.department || '',
            experience: o.experience || '',
            tags: Array.isArray(o.keywords) ? o.keywords : [],
            skillsNames: Array.isArray(o.skills) ? o.skills.map((s) => s?.name).filter(Boolean) : [],
            logoUrl: (o && o.company && typeof o.company === 'object' && o.company.imageUrl) ? o.company.imageUrl : '',
            category: undefined,
            level: undefined,
            description: o.mission || '',
          }))
        try { console.log('[jobs] mapped offers:', mapped) } catch {}
        setAllJobs(mapped)
      } catch (_e) {
        try { console.error('[jobs] /offers error:', _e) } catch {}
        setAllJobs([])
      }
    })()
  }, [request])

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')

  const categories = useMemo(() => [...new Set(allJobs.map(j => j.department).filter(Boolean))], [allJobs])
  const levels = useMemo(() => [...new Set(allJobs.map(j => j.experience).filter(Boolean))], [allJobs])
  const types = useMemo(() => [...new Set(allJobs.map(j => j.contractType).filter(Boolean))], [allJobs])
  const locations = useMemo(() => [...new Set(allJobs.map(j => j.location).filter(Boolean))], [allJobs])

  const filteredJobs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return allJobs.filter(job => {
      const haystack = [
        job.title,
        job.company,
        job.department,
        job.location,
        job.contractType,
        job.contractDuration,
        job.experience,
        ...(job.tags || []),
        ...(job.skillsNames || []),
      ].filter(Boolean).map((v) => String(v).toLowerCase())

      const matchesSearch = !query || haystack.some((v) => v.includes(query))

      const matchesCategory = !selectedCategory || job.department === selectedCategory
      const matchesLevel = !selectedLevel || job.experience === selectedLevel
      const matchesType = !selectedType || job.contractType === selectedType
      const matchesLocation = !selectedLocation || job.location === selectedLocation

      return matchesSearch && matchesCategory && matchesLevel && matchesType && matchesLocation
    })
  }, [allJobs, searchQuery, selectedCategory, selectedLevel, selectedType, selectedLocation])

  const resetFilters = useCallback(() => {
    setSearchQuery('')
    setSelectedCategory('')
    setSelectedLevel('')
    setSelectedType('')
    setSelectedLocation('')
  }, [])

  return {
    allJobs,
    filteredJobs,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedLevel,
    setSelectedLevel,
    selectedType,
    setSelectedType,
    selectedLocation,
    setSelectedLocation,
    categories,
    levels,
    types,
    locations,
    resetFilters,
    companyInfo,
  }
}


