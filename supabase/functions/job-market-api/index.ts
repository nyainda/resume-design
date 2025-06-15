
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { query, location = '', remote = false, limit = 20 } = await req.json()
    
    let allJobs: any[] = []
    let dataSources: string[] = []
    
    // Try RapidAPI JSearch first (for Indeed, LinkedIn, etc.)
    try {
      const rapidApiKey = Deno.env.get('RAPIDAPI_KEY')
      
      if (rapidApiKey) {
        console.log('Fetching from RapidAPI JSearch...')
        const searchQuery = remote ? `${query} remote` : `${query} ${location}`.trim()
        const jsearchUrl = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(searchQuery)}&page=1&num_pages=1&date_posted=all&remote_jobs_only=${remote ? 'true' : 'false'}`
        
        const jsearchResponse = await fetch(jsearchUrl, {
          headers: {
            'X-RapidAPI-Key': rapidApiKey,
            'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
          }
        })
        
        if (jsearchResponse.ok) {
          const jsearchData = await jsearchResponse.json()
          console.log('JSearch response status:', jsearchData.status)
          
          if (jsearchData.status === 'OK' && jsearchData.data) {
            const jsearchJobs = jsearchData.data.slice(0, Math.floor(limit / 3)).map((job: any) => ({
              id: job.job_id || Math.random().toString(36).substr(2, 9),
              title: job.job_title || 'No title available',
              company: job.employer_name || 'Company not specified',
              location: job.job_is_remote 
                ? 'Remote' 
                : job.job_city && job.job_state 
                  ? `${job.job_city}, ${job.job_state}` 
                  : job.job_country || location || 'Location not specified',
              remote: job.job_is_remote || false,
              salary: job.job_min_salary && job.job_max_salary
                ? `$${Math.round(job.job_min_salary).toLocaleString()} - $${Math.round(job.job_max_salary).toLocaleString()}`
                : job.job_min_salary
                  ? `From $${Math.round(job.job_min_salary).toLocaleString()}`
                  : job.job_salary_period && job.job_salary_currency
                    ? `${job.job_salary_currency} ${job.job_salary_period}`
                    : 'Salary not specified',
              description: job.job_description?.substring(0, 200) + '...' || 'No description available',
              requirements: job.job_required_skills?.slice(0, 5) || job.job_required_experience ? [job.job_required_experience] : ['Not specified'],
              posted: job.job_posted_at ? new Date(job.job_posted_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
              url: job.job_apply_link || job.job_google_link || '#',
              source: 'JSearch (Indeed/LinkedIn)'
            }))
            
            allJobs.push(...jsearchJobs)
            if (jsearchJobs.length > 0) dataSources.push('JSearch')
            console.log(`Found ${jsearchJobs.length} jobs from JSearch`)
          } else {
            console.log('JSearch API returned no data or error status')
          }
        } else {
          console.log('JSearch API response not ok:', jsearchResponse.status)
        }
      } else {
        console.log('No RapidAPI key found')
      }
    } catch (error) {
      console.error('JSearch API error:', error)
    }

    // Try RemoteOK API (great for remote jobs)
    try {
      console.log('Fetching from RemoteOK API...')
      const remoteOkUrl = 'https://remoteok.com/api'
      const remoteOkResponse = await fetch(remoteOkUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; JobSearch/1.0)'
        }
      })
      
      if (remoteOkResponse.ok) {
        const remoteOkData = await remoteOkResponse.json()
        // RemoteOK returns an array, first item is metadata, rest are jobs
        const remoteJobs = remoteOkData.slice(1).filter((job: any) => {
          if (!query) return true
          const searchText = `${job.position || ''} ${job.description || ''} ${job.tags?.join(' ') || ''}`.toLowerCase()
          return searchText.includes(query.toLowerCase())
        }).slice(0, Math.floor(limit / 3)).map((job: any) => ({
          id: job.id || Math.random().toString(36).substr(2, 9),
          title: job.position || 'No title available',
          company: job.company || 'Company not specified',
          location: 'Remote',
          remote: true,
          salary: job.salary_range || 'Competitive salary',
          description: job.description?.substring(0, 200) + '...' || 'No description available',
          requirements: job.tags?.slice(0, 5) || ['Remote work'],
          posted: job.date ? new Date(job.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          url: job.url || `https://remoteok.com/remote-jobs/${job.id}`,
          source: 'RemoteOK'
        }))
        
        allJobs.push(...remoteJobs)
        if (remoteJobs.length > 0) dataSources.push('RemoteOK')
        console.log(`Found ${remoteJobs.length} jobs from RemoteOK`)
      }
    } catch (error) {
      console.error('RemoteOK API error:', error)
    }

    // Try Adzuna API
    try {
      const adzunaAppId = Deno.env.get('ADZUNA_APP_ID')
      const adzunaApiKey = Deno.env.get('ADZUNA_API_KEY')
      
      if (adzunaAppId && adzunaApiKey && allJobs.length < limit) {
        console.log('Fetching from Adzuna API...')
        const country = 'us'
        const remainingSlots = limit - allJobs.length
        const adzunaUrl = `https://api.adzuna.com/v1/api/jobs/${country}/search/1?app_id=${adzunaAppId}&app_key=${adzunaApiKey}&results_per_page=${Math.min(remainingSlots, 10)}&what=${encodeURIComponent(query)}&where=${encodeURIComponent(location)}`
        
        const adzunaResponse = await fetch(adzunaUrl)
        if (adzunaResponse.ok) {
          const adzunaData = await adzunaResponse.json()
          const adzunaJobs = adzunaData.results?.map((job: any) => ({
            id: job.id || Math.random().toString(36).substr(2, 9),
            title: job.title || 'No title available',
            company: job.company?.display_name || 'Company not specified',
            location: job.location?.display_name || location || 'Location not specified',
            remote: job.location?.display_name?.toLowerCase().includes('remote') || 
                   job.title?.toLowerCase().includes('remote') || 
                   job.description?.toLowerCase().includes('remote work') || false,
            salary: job.salary_min && job.salary_max 
              ? `$${Math.round(job.salary_min).toLocaleString()} - $${Math.round(job.salary_max).toLocaleString()}`
              : job.salary_min 
                ? `From $${Math.round(job.salary_min).toLocaleString()}`
                : 'Salary not specified',
            description: job.description?.replace(/<[^>]*>/g, '').substring(0, 200) + '...' || 'No description available',
            requirements: job.category?.tag ? [job.category.tag] : ['Not specified'],
            posted: job.created ? new Date(job.created).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            url: job.redirect_url || '#',
            source: 'Adzuna'
          })) || []
          
          allJobs.push(...adzunaJobs)
          if (adzunaJobs.length > 0) dataSources.push('Adzuna')
          console.log(`Found ${adzunaJobs.length} jobs from Adzuna`)
        }
      }
    } catch (error) {
      console.error('Adzuna API error:', error)
    }

    // If no jobs from APIs, provide enhanced mock data
    if (allJobs.length === 0) {
      console.log('Using mock data fallback')
      allJobs = [
        {
          id: '1',
          title: `${query || 'Software'} Engineer`,
          company: 'TechCorp Solutions',
          location: remote ? 'Remote' : (location || 'San Francisco, CA'),
          remote: remote,
          salary: '$85,000 - $125,000',
          description: `We are seeking a talented ${query || 'software'} professional to join our innovative team. This role offers exciting opportunities to work with cutting-edge technologies.`,
          requirements: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Git'],
          posted: '2024-01-15',
          url: 'https://example.com/job/1',
          source: 'Mock'
        },
        {
          id: '2',
          title: `Senior ${query || 'Frontend'} Developer`,
          company: 'Digital Innovations Inc',
          location: 'Remote',
          remote: true,
          salary: '$95,000 - $140,000',
          description: `Join our dynamic remote team and lead the development of next-generation web applications with competitive compensation.`,
          requirements: ['React', 'Vue.js', 'CSS', 'JavaScript', 'Remote collaboration'],
          posted: '2024-01-14',
          url: 'https://example.com/job/2',
          source: 'Mock'
        },
        {
          id: '3',
          title: `Remote ${query || 'Full Stack'} Developer`,
          company: 'StartupXYZ',
          location: 'Remote',
          remote: true,
          salary: '$75,000 - $115,000',
          description: `Work from anywhere as a versatile developer building amazing products. Perfect for someone wanting remote flexibility.`,
          requirements: ['Python', 'Django', 'React', 'PostgreSQL', 'Remote work'],
          posted: '2024-01-13',
          url: 'https://example.com/job/3',
          source: 'Mock'
        }
      ]
      dataSources.push('Mock')
    }

    // Enhanced filtering
    let filteredJobs = allJobs.filter(job => {
      const matchesQuery = !query || 
        job.title.toLowerCase().includes(query.toLowerCase()) ||
        job.description.toLowerCase().includes(query.toLowerCase()) ||
        job.requirements.some((req: string) => req.toLowerCase().includes(query.toLowerCase()))
      
      const matchesLocation = !location || 
        job.location.toLowerCase().includes(location.toLowerCase()) ||
        job.remote
      
      const matchesRemote = !remote || job.remote

      return matchesQuery && matchesLocation && matchesRemote
    })

    // Sort jobs - prioritize remote jobs if remote filter is on, otherwise by recency
    filteredJobs.sort((a, b) => {
      if (remote) {
        if (a.remote && !b.remote) return -1
        if (!a.remote && b.remote) return 1
      }
      return new Date(b.posted).getTime() - new Date(a.posted).getTime()
    })

    // Limit results
    filteredJobs = filteredJobs.slice(0, limit)

    const responseData = {
      jobs: filteredJobs,
      total: filteredJobs.length,
      query,
      location,
      remote,
      sources: dataSources,
      source: dataSources.length > 1 ? 'multiple' : dataSources[0] || 'none'
    }

    console.log(`Returning ${filteredJobs.length} jobs from sources: ${dataSources.join(', ')}`)

    return new Response(
      JSON.stringify(responseData),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error in job-market-api function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        jobs: [],
        total: 0,
        sources: ['error']
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})
